const fetch = require("./fetch");
const mock = require("./mock-cf");
const firebase = require("./firebase-db");
const ratings = require("./ratings");

const { log } = require("firebase-functions/lib/logger");

const DASHBOARD_CONTESTS_PER_PAGE = 4;

exports.serveDashboardRequest = function(req, res) {
  const userHandle = req.query.handle;
  const pageNum = parseInt(req.query.page) || 1;
  if (!userHandle) {
    res.status(400).json({ status: "FAILED", comment: `Invalid handle ${userHandle}`});
  } else {
    getDashboardData(userHandle, pageNum).then((result) => {
      log(`Serving ${userHandle} dashboard`);
      res.json(result);
    })
    .catch((err) => {
      log(`Failed to serve user ${userHandle}`);
      res.status(400).json({ status: "FAILED", comment: `Handle ${userHandle} not found` });
    });
  }
}

exports.serveContestDetailsRequest = function(req, res) {
  const contestId = req.query.contestId;
  if (!contestId) {
    res.status(400).json({ status: "FAILED", comment: `Invalid contest ${contestId}`});
  } else {
    getContestDetails(contestId).then((result) => {
      log(`Serving ${contestId} details`);
      res.json(result);
    }).catch((err) => {
      log(`Failed to serve contest ${contestId}`);
      res.status(400).json({ status: "FAILED", comment: `Contest ${contestId} not found`});
    })
  }
}

function getContestDetails(contestId) {
  return getContestAnalytics(contestId).then((analytics) => {
    delete analytics.standings;
    return analytics;
  });
}

function getDashboardData(userHandle, pageNum) {
  /**
   * pageNum is 1-indexed
   * 
   *  [
   *    {
   *      contestId: 1,
   *      contestName: "Codeforces Beta Round #1",
   *      expectedRank: 1,
   *      actualRank: 1,
   *      oldRating: 2000,
   *      newRating: 2000,
   *      performance: 2000
   *    },
   *    ...
   *  ]
   */
  log(`Enter getDashboardData(${userHandle}, page ${pageNum})`);
  return fetch.requestUserContestHistory(userHandle).then((contestHistory) => {
    if (contestHistory && contestHistory.status == "OK") {
      contestHistory = contestHistory.result.reverse();
      const numPages = Math.floor((contestHistory.length + DASHBOARD_CONTESTS_PER_PAGE - 1) / DASHBOARD_CONTESTS_PER_PAGE);
      pageNum = Math.max(1, Math.min(pageNum, numPages));
      log(`Adjusted page num: ${pageNum}`);
      const promiseList = [];

      for (let i = 0; i < DASHBOARD_CONTESTS_PER_PAGE; i++) {
        let ind = (pageNum - 1) * DASHBOARD_CONTESTS_PER_PAGE + i;
        if (ind >= contestHistory.length)
          break;

        let contest = contestHistory[ind];
        log("generating user report contest " + contest.contestId);
        contest.delta = contest.newRating - contest.oldRating;
        contest.actualRank = contest.rank;

        const cur = contest;
        promiseList.push(getContestAnalytics(cur.contestId).then((contestDoc) => {
          cur.expectedRank = calculateSeed(contestDoc.standings, cur.oldRating, cur.rank);
          cur.performance = calculatePerformance(contestDoc.standings, cur.rank);
          return cur;
        }));
      }

      return Promise.all(promiseList).then((contestAnalyticsList) => {
        return {
          numPages: numPages,
          result: contestAnalyticsList
        };
      })
    } else {
      log(`CF API contest history request failed: ${userHandle}`);
      throw new Error("CF API contest history request failed: ${userHandle}");
    }
  });
}

function calculateSeed(standingsRatings, queryRating, queryRank) {
  let seed = 1;
  for (let rank = 0; rank < standingsRatings.length; rank++) {
    if (rank + 1 == queryRank)
      continue;
    
    // https://codeforces.com/blog/entry/20762
    const lossProb = 1 / (1 + Math.pow(10, (queryRating - standingsRatings[rank]) / 400));
    seed += lossProb;
  }
  return Math.round(seed);
}

function calculatePerformance(standingsRatings, queryRank) {
  if (queryRank == 1)
    return 3800;

  let loRating = 0;
  let hiRating = 5000;
  while (loRating < hiRating) {
    const midRating = Math.ceil((loRating + hiRating) / 2);
    const seed = Math.round(calculateSeed(standingsRatings, midRating, queryRank));
    if (seed < queryRank) {
      hiRating = midRating - 1;
    } else {
      loRating = midRating;
    }
  }
  return loRating;
}

function getContestAnalytics(contestId) {
  return firebase.db.doc(`contests/${contestId}`).get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      log(`Retrieved contest ${contestId} from db`);
      return docSnapshot.data();
    } else {
      log(`Contest ${contestId} not in db, getting data now`);
      return addContestAnalyticsToDatabase(contestId, docSnapshot);
    }
  });
}

function addContestAnalyticsToDatabase(contestId, docSnapshot) {
  /**
   *  Database format:
   * 
   *  contests/`contestId`
   *  {
   *      type: "CF" | "ICPC",
   *      name: "Round 1",
   *      participation: [
   *          { rank: "newbie", count: 10 },
   *          ...
   *      ],
   *      problems: [
   *          {
   *              index: "A",
   *              name: "Matching Names",
   *              solves: [
   *                  { rank: "newbie", count: 2 },
   *                  ...
   *              ]
   *          },
   *          ...
   *      ],
   *      standings: [
   *          3200,
   *          1638,
   *          2419,
   *          ...
   *      ]
   *  }
   */    
  return fetch.requestContestData(contestId).then((data) => {
    log(`${contestId} analytics: problem stats`);
    const problemsList = data.problems.map((prob) => {
      const problemObj = {
        index: prob.index,
        name: prob.name,
        // ICPC-style contests omit points
        points: prob.points || 1
      };
      problemObj.solves = ratings.ratingCutoffs.map((cutoff) => ({ rank: cutoff.title, count: 0 }));
      return problemObj;
    });

    // Some contests (edu rounds) include div1 participants in only `data.rows` but not `data.ratings`. We cannot include
    // these participants in analysis since their rating is unknown (because they are not in `data.ratings`). Therefore, we 
    // convert `data.rows` into a lookup table and use `data.ratings` as our actual pool of participants.
    const participantMap = {};
    for (const participant of data.rows) {
      participantMap[participant.party.members[0].handle] = participant;
    }
    for (let i = 0; i < data.ratings.length; i++) {
      const participant = participantMap[data.ratings[i].handle];
      const curRating = data.ratings[i].rating;
      for (let j = 0; j < participant.problemResults.length; j++) {
        if (participant.problemResults[j].points) {
          problemsList[j].solves[ratings.fromRatingGetIndex(curRating)].count++;
        }
      }
    }
    
    log(`${contestId} analytics: participation`);
    const ratingsWithoutHandles = data.ratings.map((handleAndRating) => handleAndRating.rating);
    const participation = ratings.ratingCutoffs.map((cutoff) => ({ rank: cutoff.title, count: 0 }));
    for (const rating of ratingsWithoutHandles) {
      participation[ratings.fromRatingGetIndex(rating)].count++;
    }

    log(`${contestId} analytics: benchmarks`);
    const benchmarks = ratings.ratingCutoffs.map((cutoff) => {
      const seed = calculateSeed(ratingsWithoutHandles, cutoff.from, -1);
      const models = [];
      for (let offset = -1; offset <= 1; offset++) {
        if (seed + offset < 1 || seed + offset > data.ratings.length)
          continue;
        const curModel = participantMap[data.ratings[seed + offset - 1].handle];
        for (const curProblemResult of curModel.problemResults) {
          if (!curProblemResult.bestSubmissionTimeSeconds)
            continue;
          curProblemResult.bestSubmissionTimeMinutes = Math.floor(curProblemResult.bestSubmissionTimeSeconds / 60) % 60;
          curProblemResult.bestSubmissionTimeHours = Math.floor(curProblemResult.bestSubmissionTimeSeconds / 3600);
        }        
        models.push(curModel);
      }
      return {
        rank: cutoff.title,
        models: models
      };
    });
    
    log(`Adding contest ${contestId} to db`);
    const documentData = { 
      type: data.contest.type,
      name: data.contest.name,
      problems: problemsList,
      participation: participation,
      benchmarks: benchmarks,
      standings: ratingsWithoutHandles
    };
    docSnapshot.ref.set(documentData);
    return documentData;
  });
}