"use strict";

var nock = require("nock"),
    mockListLanguagesData = require("../mockData/oxford/listLanguages");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/languages")
.reply(
    200,
    mockListLanguagesData.noError
)
.persist();
