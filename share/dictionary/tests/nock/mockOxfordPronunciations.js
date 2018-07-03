"use strict";

var nock = require("nock");
var correctWord = "bath",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

var mockPronunciationsData = require("../mockData/oxford/pronunciations")(correctWord, wrongWord);// file holding object with mock data

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
    200,
    mockPronunciationsData.correctWord
)
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
    404,
    mockPronunciationsData.wrongWord
)
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
    404,
    mockPronunciationsData.wrongLang
)
.persist();
