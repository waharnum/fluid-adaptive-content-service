"use strict";

var nock = require("nock");

//TODO: use kettle resolvers for environment variables
//TODO: mention in README that any random string is enough to run mock server
require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockTranslationData = require("../mockData/yandex/translation");

nock(urlBase)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    200,
    mockTranslationData.noError
)
// Invalid api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.invalid + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text
    }
)
.reply(
    401,
    mockTranslationData.keyInvalid
)
// Blocked api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.blocked + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text
    }
)
.reply(
    402,
    mockTranslationData.keyBlocked
)
// Exceeding daily limit
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.limitExceedTriggerText
    }
)
.reply(
    404,
    mockTranslationData.limitExceeded
)
//translation direction not supported
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.wrong + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text
    }
)
.reply(
    501,
    mockTranslationData.unsupportedTranslation
)
//invalid lang code
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.invalid + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text
    }
)
.reply(
    502,
    mockTranslationData.invalidLangCode
)
.persist();
