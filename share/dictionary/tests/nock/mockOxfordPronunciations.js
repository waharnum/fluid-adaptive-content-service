"use strict";

var nock = require("nock"),
    mockPronunciationsData = require("../mockData/oxford/pronunciations");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockPronunciationsData.apiKeys.correct
})
// no error
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.correct)
.reply(
    200,
    mockPronunciationsData.correctWord
)
// wrong word
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.wrong)
.reply(
    404,
    mockPronunciationsData.wrongWord
)
// wrong language
.get("/entries/" + mockPronunciationsData.lang.wrong + "/" + mockPronunciationsData.word.correct)
.reply(
    404,
    mockPronunciationsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockPronunciationsData.apiKeys.wrong
})
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.correct + "/antonyms")
.reply(
    403,
    mockPronunciationsData.authError
)
.persist();
