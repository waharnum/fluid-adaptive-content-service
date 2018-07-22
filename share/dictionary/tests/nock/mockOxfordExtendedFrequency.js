"use strict";

var nock = require("nock"),
    mockExtendedFrequencyData = require("../mockData/oxford/extendedFrequency")(correctWord, frequency, lexicalCategory);// file holding object with mock data

var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong",
    frequency = 123,
    lexicalCategory = "noun",
    urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockExtendedFrequencyData.apiKeys.correct
})
// no error
.get("/stats/frequency/word/" + correctLang + "/?lemma=" + correctWord + "&lexicalCategory=" + lexicalCategory)
.reply(
    200,
    mockExtendedFrequencyData.correctWord
)
// wrong language
.get("/stats/frequency/word/" + wrongLang + "/?lemma=" + correctWord + "&lexicalCategory=" + lexicalCategory)
.reply(
    404,
    mockExtendedFrequencyData.wrongLang
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
  reqheaders: mockAntonymsData.apiKeys.wrong
})
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
.reply(
  403,
  mockAntonymsData.authError
)
.persist();
