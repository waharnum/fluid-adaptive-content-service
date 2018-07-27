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
    mockListLanguagesData.responses.noError
)
.persist();

// for requests with headers having wrong authentication keys
nock(urlBase, {
    reqheaders: mockListLanguagesData.apiKeys.wrong
})
.get("/languages")
.reply(
    403,
    mockListLanguagesData.responses.authError
)
.persist();
