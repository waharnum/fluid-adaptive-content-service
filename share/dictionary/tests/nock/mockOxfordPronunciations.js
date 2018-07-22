"use strict";

var nock = require("nock"),
    mockPronunciationsData = require("../mockData/oxford/pronunciations")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "bath",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockPronunciationsData.apiKeys.correct
})
// no error
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
    200,
    mockPronunciationsData.correctWord
)
// wrong word
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
    404,
    mockPronunciationsData.wrongWord
)
// wrong language
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
    404,
    mockPronunciationsData.wrongLang
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
