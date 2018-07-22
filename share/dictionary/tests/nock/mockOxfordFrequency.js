"use strict";

var nock = require("nock"),
    mockFrequencyData = require("../mockData/oxford/frequency")(correctWord, frequency);// file holding object with mock data

var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong",
    frequency = 8458134,
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockFrequencyData.apiKeys.correct
})
// no error
.get("/stats/frequency/word/" + correctLang + "/?lemma=" + correctWord)
.reply(
    200,
    mockFrequencyData.correctWord
)
// wrong language
.get("/stats/frequency/word/" + wrongLang + "/?lemma=" + correctWord)
.reply(
    404,
    mockFrequencyData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockFrequencyData.apiKeys.wrong
})
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
    403,
    mockFrequencyData.authError
)
.persist();
