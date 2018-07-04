"use strict";

var nock = require("nock");

//TODO: use kettle resolvers for environment variables
require("dotenv").config();//npm package to get variables from '.env' file

var sourceLang = "en",
    targetLang = "de",
    text = "This is the text to be translated",
    apiKey = process.env.YANDEX_APP_KEY,
    urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

nock(urlBase)
.post(
    "translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
    {
        text: text
    }  
)
.reply(
    200,
    mockAntonymsData.correctWord
)
// .get("/entries/" + correctLang + "/" + wrongWord + "/antonyms")
// .reply(
//     404,
//     mockAntonymsData.wrongWord
// )
// .get("/entries/" + wrongLang + "/" + correctWord + "/antonyms")
// .reply(
//     404,
//     mockAntonymsData.wrongLang
// )
.persist();
