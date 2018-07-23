"use strict";

var nock = require("nock"),
    mockAntonymsData = require("../mockData/oxford/antonyms");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockAntonymsData.apiKeys.correct
})
// no errors
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.correct + "/antonyms")
.reply(
    200,
    mockAntonymsData.correctWord
)
// wrong word
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.wrong + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongWord
)
// wrong language
.get("/entries/" + mockAntonymsData.lang.wrong + "/" + mockAntonymsData.word.correct + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockAntonymsData.apiKeys.wrong
})
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.correct + "/antonyms")
.reply(
    403,
    mockAntonymsData.authError
)
.persist();
