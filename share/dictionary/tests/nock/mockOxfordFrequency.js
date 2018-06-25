"use strict";

var nock = require("nock");
var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/stats/frequency/word/" + correctLang + "/?lemma=" + correctWord)
.reply(
    200,
    {
        result: {
            frequency: 8458134,
            lemma: "play"
        }
    }
)
.get("/stats/frequency/word/" + wrongLang + "/?lemma=" + correctWord)
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in zu, ro, ta, sw, de, tn, lv, id, ur, en, nso, ms, gu, pt, hi, es</p>"
)
.persist();
