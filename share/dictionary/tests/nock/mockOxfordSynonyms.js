"use strict";

var nock = require("nock"),
    mockSynonymsData = require("../mockData/oxford/synonyms")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockSynonymsData.apiKeys.correct
})
// no error
.get("/entries/" + correctLang + "/" + correctWord + "/synonyms")
.reply(
    200,
    mockSynonymsData.correctWord
)
// wrong word
.get("/entries/" + correctLang + "/" + wrongWord + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongWord
)
// wrong language
.get("/entries/" + wrongLang + "/" + correctWord + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockSynonymsData.apiKeys.wrong
})
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    403,
    mockSynonymsData.authError
)
.persist();
