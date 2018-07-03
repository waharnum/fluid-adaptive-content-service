"use strict";

var nock = require("nock");
var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong",
    frequency = 8458134;

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

var mockFrequencyData = require("../mockData/oxford/frequency")(correctWord, frequency);// file holding object with mock data

nock(urlBase)
.get("/stats/frequency/word/" + correctLang + "/?lemma=" + correctWord)
.reply(
    200,
    mockFrequencyData.correctWord
)
.get("/stats/frequency/word/" + wrongLang + "/?lemma=" + correctWord)
.reply(
    404,
    mockFrequencyData.wrongLang
)
.persist();
