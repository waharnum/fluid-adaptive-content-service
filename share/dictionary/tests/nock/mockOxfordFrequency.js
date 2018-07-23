"use strict";

var nock = require("nock"),
    mockFrequencyData = require("../mockData/oxford/frequency");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockFrequencyData.apiKeys.correct
})
// no error
.get("/stats/frequency/word/" + mockFrequencyData.lang.correct + "/?lemma=" + mockFrequencyData.word.correct)
.reply(
    200,
    mockFrequencyData.correctWord
)
// wrong language
.get("/stats/frequency/word/" + mockFrequencyData.lang.wrong + "/?lemma=" + mockFrequencyData.word.correct)
.reply(
    404,
    mockFrequencyData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockFrequencyData.apiKeys.wrong
})
.get("/entries/" + mockFrequencyData.lang.correct + "/" + mockFrequencyData.word.correct + "/antonyms")
.reply(
    403,
    mockFrequencyData.authError
)
.persist();
