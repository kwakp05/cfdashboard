const core = require('./core');
const mockCf = require('./mock-cf');

const express = require('express');
const cors = require('cors');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// mock CF HTTP endpoints
app.get("/mock/contest.ratingChanges", (req, res) => {
  if (req.query.contestId == 420)
    res.status(400).send("mocked contest rating error");
  else
    res.json(mockCf.mockContestRatingChanges(req.query.contestId));
});

app.get("/mock/contest.standings", (req, res) => {
  if (req.query.contestId == 420)
    res.status(400).send("mocked contest standings error");
  else
    res.json(mockCf.mockContestStandings(req.query.contestId));
});

app.get("/mock/user.rating", (req, res) => {
  if (req.query.handle == "test")
    res.status(400).send("mocked user rating error");
  else
    res.json(mockCf.mockUserRating(req.query.handle));
})

app.get("/contest", core.serveContestDetailsRequest);

app.get("/dashboard", core.serveDashboardRequest);

exports.api = functions.https.onRequest(app);