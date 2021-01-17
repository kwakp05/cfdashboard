const https = require("https");
const http = require("http");
const url = require("url");
const functions = require("firebase-functions");
const { log } = require("firebase-functions/lib/logger");

const HTTP_REQUEST_RETRIES = 5;
const HTTP_REQUEST_DELAY_MS = 1000;

const HTTP_STATUS_CODE_TOO_MANY_REQUESTS = 429;

exports.requestUserContestHistory = function(userHandle) {
    /**
     *  https://codeforces.com/apiHelp/methods#user.rating
     *  {
     *      status: "OK",
     *      result: [
     *          {
     *              contestId: 1,
     *              contestName: "Round 1",
     *              handle: "tourist",
     *              rank: 1,
     *              ratingUpdateTimeSeconds: 123,
     *              oldRating: 3000,
     *              newRating: 3200
     *          },
     *          ...
     *      ]
     *  }
     */
    return makeRequestWithRetries("/user.rating", { handle: userHandle }).then((result) => {
        if (result.status == "OK")
            return result;
        throw result;
    });
}

exports.requestContestRatingChanges = function(contestId) {
    /**
     *  https://codeforces.com/apiHelp/methods#contest.ratingChanges
     *  {
     *      status: "OK",
     *      result: [
     *          {
     *              contestId: 1,
     *              contestName: "Round 1",
     *              handle: "tourist",
     *              rank: 1,
     *              ratingUpdateTimeSeconds: 123,
     *              oldRating: 3000,
     *              newRating: 3200
     *          },
     *          ...
     *      ]
     *  }
     */
    return makeRequestWithRetries("/contest.ratingChanges", { contestId: contestId }).then((result) => {
        if (result && result.status == "OK")
            return result.result;
        throw result;
    });
}

exports.requestContestStandings = function(contestId) {
    /**
     *  https://codeforces.com/apiHelp/methods#contest.standings
     *  {
     *      status: "OK",
     *      result: {
     *          contest: {
     *              id: 123,
     *              name: "Global Round 1",
     *              type: "CF" | "IOI" | "ICPC",
     *              phase: "BEFORE" | "CODING" | "PENDING_SYSTEM_TEST" | "SYSTEM_TEST" | "FINISHED",
     *              frozen: false,
     *              durationSeconds: 10800,
     *              startTimeSeconds: 1000,
     *              relativeTimeSeconds: 1200
     *          },
     *          problems: [
     *              {
     *                  contestId: 123,
     *                  index: "A",
     *                  name: "a tough problem",
     *                  type: "PROGRAMMING" | "QUESTION",
     *                  points: 2500 (absent for ICPC-style contests),
     *                  rating: 2300,
     *                  tags: [ "dp", "greedy" ]
     *              },
     *              ...
     *          ],
     *          rows: [
     *              {
     *                  party: {
     *                      contestId: 123,
     *                      members: [
     *                          { handle: "tourist" }
     *                      ],
     *                      participantType: "CONTESTANT" | "PRACTICE" | "VIRTUAL" | "MANAGER" | "OUT_OF_COMPETITION",
     *                      ghost: false,
     *                      room: 12,
     *                      startTimeSeconds: 1000
     *                  },
     *                  rank: 1,
     *                  points: 5000,
     *                  penalty: 12 (ICPC-style penalty),
     *                  successfulHackCount: 1,
     *                  unsuccessfulHackCount: 1,
     *                  problemResults: [
     *                      {
     *                          points: 1312,
     *                          penalty: 12 (ICPC-style penalty),
     *                          rejectedAttemptCount: 2,
     *                          type: "PRELIMINARY" | "FINAL",
     *                          bestSubmissionTimeSeconds: 3624
     *                      },
     *                      ...
     *                  ]
     *              },
     *              ...
     *          ]
     *      }
     *  }
     */
    return makeRequestWithRetries("/contest.standings", { contestId: contestId, showUnofficial: false }).then((result) => {
        if (result && result.status == "OK")
            return result.result;
        throw result;
    });
}

exports.requestContestData = function(contestId) {
    const contestRatingChangesPromise = this.requestContestRatingChanges(contestId).then((result) => {
        return result.map((ranklistRow) => ({ handle: ranklistRow.handle, rating: ranklistRow.oldRating }));
    });
    const contestStandingsPromise = this.requestContestStandings(contestId);
    return Promise.all([contestRatingChangesPromise, contestStandingsPromise]).then((values) => {
        values[1].ratings = values[0];
        return values[1];
    });
}

function constructUrl(path, queryParams) {
    const requestUrl = new url.URL(functions.config().api.url);
    requestUrl.pathname += path;
    for (const param in queryParams) {
        requestUrl.searchParams.set(param, queryParams[param]);
    }
    return requestUrl;
}

function makeRequest(path, queryParams) {
    const requestUrl = constructUrl(path, queryParams);
    log(`Making request to ${requestUrl.href}`);
    return new Promise((resolve, reject) => {
        let prot = undefined;
        if (requestUrl.protocol == "https:") {
            prot = https;
        } else if (requestUrl.protocol == "http:") {
            prot = http;
        } else {
            reject();
        }

        prot.get(requestUrl, (result) => {
            const { statusCode } = result;
            if (statusCode != 200) {
                log(`Status code ${statusCode} from ${requestUrl.href}`);

                // Make sure to consume the input stream
                // https://nodejs.org/api/http.html#http_class_http_clientrequest
                result.resume();

                reject(statusCode);
            }

            let respData = "";
            result.on("data", (chunk) => { respData += chunk; });
            result.on("end", () => {
                if (statusCode != 200)
                    return;
                log(`End of response from ${requestUrl.href}`);
                resolve(JSON.parse(respData));
            });
        });
    });
}

async function makeRequestWithRetries(path, queryParams) {
    const requestUrl = constructUrl(path, queryParams);
    for (let i = 0; i < HTTP_REQUEST_RETRIES; i++) {
        try {
            return await makeRequest(path, queryParams);
        } catch (err) {
            log(`Http request failed (${i}) code ${err} ${requestUrl.href}`);
            // Only retry on rate limit exceeded
            if (err == HTTP_STATUS_CODE_TOO_MANY_REQUESTS) {
                log(`Retry in ${HTTP_REQUEST_DELAY_MS}ms, ${requestUrl.href}`);
                await new Promise((res) => setTimeout(res, HTTP_REQUEST_DELAY_MS));
            } else {
                break;
            }
            
        }
    }
    log(`Http request w/ retry failed ${requestUrl.href}`);
    throw new Error(`Http request failed ${requestUrl.href}`);
} 