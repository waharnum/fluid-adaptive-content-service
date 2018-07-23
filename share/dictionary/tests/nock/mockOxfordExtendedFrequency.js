"use strict";

var nock = require("nock"),
    mockExtendedFrequencyData = require("../mockData/oxford/extendedFrequency");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockExtendedFrequencyData.apiKeys.correct
})
// no error
.get("/stats/frequency/word/" + mockExtendedFrequencyData.lang.correct + "/?lemma=" + mockExtendedFrequencyData.word.correct + "&lexicalCategory=" + mockExtendedFrequencyData.lexicalCategory)
.reply(
    200,
    mockExtendedFrequencyData.correctWord
)
// wrong language
.get("/stats/frequency/word/" + mockExtendedFrequencyData.lang.wrong + "/?lemma=" + mockExtendedFrequencyData.word.correct + "&lexicalCategory=" + mockExtendedFrequencyData.lexicalCategory)
.reply(
    404,
    mockExtendedFrequencyData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockExtendedFrequencyData.apiKeys.wrong
})
.get("/entries/" + mockExtendedFrequencyData.lang.correct + "/" + mockExtendedFrequencyData.word.correct + "/antonyms")
.reply(
    403,
    mockExtendedFrequencyData.authError
)
.persist();
