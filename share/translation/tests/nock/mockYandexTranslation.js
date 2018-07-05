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
    apiKey = process.env.YANDEX_APP_KEY,
    invalidApiKey = "randomstring",
    urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

nock(urlBase)
.post(
    "/translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    200,
    {
        "code": 200,
        "lang": sourceLang + "-" + targetLang,
        "text": [ "Dies ist der text, der übersetzt werden" ]
    }
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
    {
        "code": 401,
        "message": "Invalid API key"
    }
)
// Exceeding daily limit
.port(
    "/translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    404,
    {
        "code": 404,
        "message": "Exceeded the daily limit on the amount of translated text"
    }
)
//translation direction not supported
.port(
    "/translate?key=" + apiKey + "&lang=" + wrongLang + "-" + targetLang,
    {
        text: text
    }
)
.reply(
    501,
    {
        "code": 501,
        "message": "The specified translation direction is not supported"
    }
)
//invalid lang code
.port(
    "/translate?key=" + apiKey + "&lang=" + invalidLang + "-" + targetLang,
    {
        text: text
    }
)
  .reply(
    502,
    {
        "code": 502,
        "message": "Invalide 'lang' parameter"
    }
)
.persist();
