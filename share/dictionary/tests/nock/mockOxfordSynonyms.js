"use strict";

var nock = require("nock"),
    mockSynonymsData = require("../mockData/oxford/synonyms");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockSynonymsData.apiKeys.correct
})
// no error
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.correct + "/synonyms")
.reply(
    200,
    mockSynonymsData.correctWord
)
// wrong word
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.wrong + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongWord
)
// wrong language
.get("/entries/" + mockSynonymsData.lang.wrong + "/" + mockSynonymsData.word.correct + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockSynonymsData.apiKeys.wrong
})
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.correct + "/antonyms")
.reply(
    403,
    mockSynonymsData.authError
)
.persist();
