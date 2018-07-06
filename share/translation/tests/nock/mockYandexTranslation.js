"use strict";

var nock = require("nock");

//TODO: use kettle resolvers for environment variables
//TODO: mention in README that any random string is enough to run mock server
require("dotenv").config();//npm package to get variables from '.env' file

var sourceLang = "en",
    targetLang = "de",
    wrongLang = "eng", // valid lang code, but not found
    invalidLang = "english", // greater than 3 digit
    text = "This is the text to be translated",
    limitExceedText = "Text to trigger limit exceeded endpoint",
    apiKey = process.env.YANDEX_APP_KEY,
    invalidApiKey = "randomstring",
    blockedApiKey = "blockedkey",
    urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockTranslationData = require("../mockData/yandex/translation")(sourceLang, targetLang);

nock(urlBase)
.post(
    "/translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    200,
    mockTranslationData.noError
)
// Invalid api key
.post(
    "/translate?key=" + invalidApiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    401,
    mockTranslationData.keyInvalid
)
// Blocked api key
.post(
    "/translate?key=" + blockedApiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    402,
    mockTranslationData.keyBlocked
)
// Exceeding daily limit
.post(
    "/translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: limitExceedText
    }
)
.reply(
    404,
    mockTranslationData.limitExceeded
)
//translation direction not supported
.post(
    "/translate?key=" + apiKey + "&lang=" + wrongLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    501,
    mockTranslationData.unsupportedTranslation
)
//invalid lang code
.post(
    "/translate?key=" + apiKey + "&lang=" + invalidLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    502,
    mockTranslationData.invalidLangCode
)
.persist();
