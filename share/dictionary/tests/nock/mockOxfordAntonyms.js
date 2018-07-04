"use strict";

var nock = require("nock"),
    mockAntonymsData = require("../mockData/oxford/antonyms")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    200,
    mockAntonymsData.correctWord
)
.get("/entries/" + correctLang + "/" + wrongWord + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongWord
)
.get("/entries/" + wrongLang + "/" + correctWord + "/antonyms")
.reply(
    404,
    mockAntonymsData.wrongLang
)
.persist();
