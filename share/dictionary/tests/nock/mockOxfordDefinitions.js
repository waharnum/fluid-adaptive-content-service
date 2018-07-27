"use strict";

var nock = require("nock"),
    mockDefinitionsData = require("../mockData/oxford/definitions");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockDefinitionsData.apiKeys.correct
})
// no error
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.correct)
.reply(
    200,
    mockDefinitionsData.responses.correctWord
)
// wrong word
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.wrong)
.reply(
    404,
    mockDefinitionsData.responses.wrongWord
)
// wrong language
.get("/entries/" + mockDefinitionsData.lang.wrong + "/" + mockDefinitionsData.word.correct)
.reply(
    404,
    mockDefinitionsData.responses.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockDefinitionsData.apiKeys.wrong
})
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.correct + "/antonyms")
.reply(
    403,
    mockDefinitionsData.responses.authError
)
.persist();
