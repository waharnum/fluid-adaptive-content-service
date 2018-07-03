"use strict";

var nock = require("nock");
var correctWord = "word",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

var mockDefinitionsData = require("../mockData/oxford/definitions")(correctWord, wrongWord);// file holding object with mock data

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
    200,
    mockDefinitionsData.correctWord
)
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
    404,
    mockDefinitionsData.wrongWord
)
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
    404,
    mockDefinitionsData.wrongLang
)
.persist();
