"use strict";

var nock = require("nock");

require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockTranslationData = require("../../mockData/yandex/translation");

nock(urlBase)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    200,
    mockTranslationData.responses.noError
)
// Invalid api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.invalid + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    401,
    mockTranslationData.responses.keyInvalid
)
// Blocked api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.blocked + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    402,
    mockTranslationData.responses.keyBlocked
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
    mockTranslationData.responses.limitExceeded
)
//translation direction not supported (wrong source lang)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.wrong + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    501,
    mockTranslationData.responses.unsupportedTranslation
)
//translation direction not supported (wrong target lang)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.wrong,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    501,
    mockTranslationData.responses.unsupportedTranslation
)
//invalid source lang code
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.invalid + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    502,
    mockTranslationData.responses.invalidLangCode
)
.persist();
