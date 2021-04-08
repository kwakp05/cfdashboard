exports.mockContestRatingChanges = function(contestId) {
    return {
        status: "OK",
        result: [
            {
                contestId: contestId,
                contestName: "Global Round 1",
                handle: "tourist",
                rank: 1,
                ratingUpdateTimeSeconds: 1438284000,
                oldRating: 2849,
                newRating: 2941
            },
            {
                contestId: contestId,
                contestName: "Global Round 1",
                handle: "peterr",
                rank: 2,
                ratingUpdateTimeSeconds: 1438284000,
                oldRating: 1803,
                newRating: 2587
            },
            {
                contestId: contestId,
                contestName: "Global Round 1",
                handle: "rng",
                rank: 3,
                ratingUpdateTimeSeconds: 1438284000,
                oldRating: 2020,
                newRating: 1800
            }
        ]
    };
}

exports.mockContestStandings = function(contestId) {
    return {
        status: "OK",
        result: {
            contest: {
                id: 123,
                name: "Global Round 1",
                type: "ICPC",
                phase: "FINISHED",
                frozen: false,
                durationSeconds: 10800,
                startTimeSeconds: 1000,
                relativeTimeSeconds: 1200
            },
            problems: [
                {
                    contestId: 123,
                    index: "A",
                    name: "a tough problem",
                    type: "PROGRAMMING",
                    points: 2500,
                    rating: 2300,
                    tags: [ "dp", "greedy" ]
                }
            ],
            rows: [
                {
                    party: {
                        contestId: 123,
                        members: [
                            { handle: "tourist" }  
                        ],
                        participantType: "CONTESTANT",
                        ghost: false,
                        room: 12,
                        startTimeSeconds: 1000
                    },
                    rank: 1,
                    points: 5000,
                    penalty: 12,
                    successfulHackCount: 1,
                    unsuccessfulHackCount: 1,
                    problemResults: [
                        {
                            points: 1312,
                            //penalty: 12, /* It appears that CF API always omits this (even for ICPC-style contests) */
                            rejectedAttemptCount: 0,
                            type: "FINAL",
                            bestSubmissionTimeSeconds: 2624
                        }
                    ]
                },
                {
                    party: {
                        contestId: 123,
                        members: [
                            { handle: "peterr" }  
                        ],
                        participantType: "CONTESTANT",
                        ghost: false,
                        room: 12,
                        startTimeSeconds: 1000
                    },
                    rank: 2,
                    points: 4000,
                    penalty: 13,
                    successfulHackCount: 1,
                    unsuccessfulHackCount: 1,
                    problemResults: [
                        {
                            points: 1201,
                            //penalty: 12,
                            rejectedAttemptCount: 1,
                            type: "FINAL",
                            bestSubmissionTimeSeconds: 4852
                        }
                    ]
                },
                {
                    party: {
                        contestId: 123,
                        members: [
                            { handle: "rng" }  
                        ],
                        participantType: "CONTESTANT",
                        ghost: false,
                        room: 12,
                        startTimeSeconds: 1000
                    },
                    rank: 3,
                    points: 3200,
                    penalty: 100,
                    successfulHackCount: 1,
                    unsuccessfulHackCount: 1,
                    problemResults: [
                        {
                            points: 0,
                            //penalty: 12,
                            rejectedAttemptCount: 2,
                            type: "FINAL"
                        }
                    ]
                }
            ]
        }
    }
}

exports.mockUserRating = function(handle) {
    return {
        status: "OK",
        result: [
            {
                contestId: 1113,
                contestName: "First Contest",
                handle: handle,
                rank: 2,
                ratingUpdateTimeSeconds: 1550343900,
                oldRating: 1500,
                newRating: 1516
            },
            {
                contestId: 1157,
                contestName: "Second Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1158,
                contestName: "Third Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Fourth Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Fifth Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Sixth Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Seventh Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Eighth Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
            {
                contestId: 1157,
                contestName: "Ninth Contest",
                handle: handle,
                rank: 4,
                ratingUpdateTimeSeconds: 1556296500,
                oldRating: 1516,
                newRating: 1584
            },
        ]
    };
}

exports.mockContestDetails = {
    type: "ICPC",
    name: "Round 2",
    participation: [
        {rank: "legendary grandmaster", count: 11},
        {rank: "international grandmaster", count: 15},
        {rank: "grandmaster", count: 40},
        {rank: "international master", count: 45},
        {rank: "master", count: 50},
        {rank: "candidate master", count: 60},
        {rank: "expert", count: 70},
        {rank: "specialist", count: 100},
        {rank: "pupil", count: 200},
        {rank: "newbie", count: 180}
    ],
    problems: [
        {
            index: "A",
            name: "Matching Names",
            solves: [
                {rank: "legendary grandmaster", count: 10},
                {rank: "international grandmaster", count: 15},
                {rank: "grandmaster", count: 40},
                {rank: "international master", count: 35},
                {rank: "master", count: 40},
                {rank: "candidate master", count: 30},
                {rank: "expert", count: 20},
                {rank: "specialist", count: 20},
                {rank: "pupil", count: 40},
                {rank: "newbie", count: 30}
            ]
        },
        {
            index: "B1",
            name: "Queries",
            solves: [
                {rank: "legendary grandmaster", count: 10},
                {rank: "international grandmaster", count: 15},
                {rank: "grandmaster", count: 20},
                {rank: "international master", count: 35},
                {rank: "master", count: 5},
                {rank: "candidate master", count: 1},
                {rank: "expert", count: 0},
                {rank: "specialist", count: 5},
                {rank: "pupil", count: 0},
                {rank: "newbie", count: 0}
            ]
        }
    ],
    benchmarks: [
        {
            rank: "legendary grandmaster",
            models: [
                {
                    handle: "rng_58",
                    points: 7000,
                    penalty: 1,
                    rank: 1,
                    successfulHackCount: 1,
                    unsuccessfulHackCount: 1,
                    problemResults: [
                        {
                            points: 2000,
                            rejectedAttemptCount: 1,
                            bestSubmissionTimeSeconds: 400
                        },
                        {
                            points: 5000,
                            rejectedAttemptCount: 0,
                            bestSubmissionTimeSeconds: 800
                        }
                    ]
                },
                {
                    handle: "tourist",
                    points: 6800,
                    penalty: 0,
                    rank: 2,
                    successfulHackCount: 0,
                    unsuccessfulHackCount: 0,
                    problemResults: [
                        {
                            points: 1900,
                            rejectedAttemptCount: 1,
                            bestSubmissionTimeSeconds: 4000
                        },
                        {
                            points: 4900,
                            rejectedAttemptCount: 2,
                            bestSubmissionTimeSeconds: 8000
                        }
                    ]
                }
            ]
        }
    ]
}