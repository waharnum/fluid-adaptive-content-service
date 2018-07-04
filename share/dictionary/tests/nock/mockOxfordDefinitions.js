"use strict";

var nock = require("nock"),
    mockDefinitionsData = require("../mockData/oxford/definitions")(correctWord, wrongWord);// file holding object with mock data

var correctWord = "word",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

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
