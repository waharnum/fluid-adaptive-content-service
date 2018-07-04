"use strict";

var nock = require("nock"),
    mockExtendedFrequencyData = require("../mockData/oxford/extendedFrequency")(correctWord, frequency, lexicalCategory);// file holding object with mock data

var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong",
    frequency = 123,
    lexicalCategory = "noun",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/stats/frequency/word/" + correctLang + "/?lemma=" + correctWord + "&lexicalCategory=" + lexicalCategory)
.reply(
    200,
    mockExtendedFrequencyData.correctWord
)
.get("/stats/frequency/word/" + wrongLang + "/?lemma=" + correctWord + "&lexicalCategory=" + lexicalCategory)
.reply(
    404,
    mockExtendedFrequencyData.wrongLang
)
.persist();
