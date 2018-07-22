"use strict";

var nock = require("nock"),
    mockDefinitionsData = require("../mockData/oxford/definitions")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "word",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockDefinitionsData.apiKeys.correct
})
// no error
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
    200,
    mockDefinitionsData.correctWord
)
// wrong word
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
    404,
    mockDefinitionsData.wrongWord
)
// wrong language
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
    404,
    mockDefinitionsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockDefinitionsData.apiKeys.wrong
})
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    403,
    mockDefinitionsData.authError
)
.persist();
