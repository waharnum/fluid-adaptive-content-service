"use strict";

var nock = require("nock"),
    mockListLanguagesData = require("../mockData/oxford/listLanguages");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase, {
    reqheaders: mockListLanguagesData.apiKeys.correct
})
.get("/languages")
.reply(
    200,
    mockListLanguagesData.noError
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
