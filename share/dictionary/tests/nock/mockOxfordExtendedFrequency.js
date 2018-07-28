"use strict";

var nock = require("nock"),
    mockExtendedFrequencyData = require("../mockData/oxford/extendedFrequency");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no error
.get("/stats/frequency/word/" + mockExtendedFrequencyData.lang.correct + "/?lemma=" + mockExtendedFrequencyData.word.correct + "&lexicalCategory=" + mockExtendedFrequencyData.lexicalCategory)
.reply(
    200,
    mockExtendedFrequencyData.responses.correctWord
)
// wrong language
.get("/stats/frequency/word/" + mockExtendedFrequencyData.lang.wrong + "/?lemma=" + mockExtendedFrequencyData.word.correct + "&lexicalCategory=" + mockExtendedFrequencyData.lexicalCategory)
.reply(
    404,
    mockExtendedFrequencyData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/entries/" + mockExtendedFrequencyData.lang.correct + "/" + mockExtendedFrequencyData.word.correct + "/antonyms")
.reply(
    403,
    mockExtendedFrequencyData.responses.authError
)
.persist();
