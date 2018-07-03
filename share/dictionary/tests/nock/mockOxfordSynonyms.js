"use strict";

var nock = require("nock");
var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

var mockSynonymsData = require("../mockData/oxford/synonyms")(correctWord, wrongWord);// file holding object with mock data

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord + "/synonyms")
.reply(
    200,
    mockSynonymsData.correctWord
)
.get("/entries/" + correctLang + "/" + wrongWord + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongWord
)
.get("/entries/" + wrongLang + "/" + correctWord + "/synonyms")
.reply(
    404,
    mockSynonymsData.wrongLang
)
.persist();
