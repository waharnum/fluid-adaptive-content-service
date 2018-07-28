"use strict";

var nock = require("nock");

require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockListLanguagesData = require("../../mockData/yandex/listLanguages");

nock(urlBase)
//no error
.post(
    "/getLangs?key=" + mockListLanguagesData.apiKey.correct + "&ui=en"
)
.reply(
    200,
    mockListLanguagesData.responses.noError
)
// Invalid api key
.post(
    "/getLangs?key=" + mockListLanguagesData.apiKey.invalid + "&ui=en"
)
.reply(
    401,
    mockListLanguagesData.responses.keyInvalid
)
// Blocked api key
.post(
    "/getLangs?key=" + mockListLanguagesData.apiKey.blocked + "&ui=en"
)
.reply(
    402,
    mockListLanguagesData.responses.keyBlocked
)
// Exceeding daily limit
.post(
    "/getLangs?key=" + mockListLanguagesData.apiKey.correct + "&ui=en"
)
.reply(
    404,
    mockListLanguagesData.responses.limitExceeded
)
.persist();
