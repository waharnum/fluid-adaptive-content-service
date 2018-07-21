"use strict";

var nock = require("nock");

require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

nock(urlBase)
//no error
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.noError
    }
)
.reply(
    200,
    mockLangDetectionData.noError
)
//unable to detect lang
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.numerical
    }
)
.reply(
    200,
    mockLangDetectionData.cannotDetect
)
.persist();
