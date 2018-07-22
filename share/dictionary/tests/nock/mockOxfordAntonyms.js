"use strict";

var nock = require("nock"),
    mockAntonymsData = require("../mockData/oxford/antonyms")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockAntonymsData.apiKeys.correct
})
// no errors
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    200,
    mockAntonymsData.correctWord
)
// wrong word
.get("/entries/" + correctLang + "/" + wrongWord + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongWord
)
// wrong language
.get("/entries/" + wrongLang + "/" + correctWord + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockAntonymsData.apiKeys.wrong
})
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    403,
    mockAntonymsData.authError
)
.persist();
