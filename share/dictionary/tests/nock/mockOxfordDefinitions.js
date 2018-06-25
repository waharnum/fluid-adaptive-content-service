"use strict";

var nock = require("nock");
var correctWord = "word",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
    200,
    {
        results: [
            {
                lexicalEntries: [
                    {
                        lexicalCategory: "Verb",
                        entries: [
                            {
                                senses: [
                                    {
                                        definitions: [
                                            "engage in activity for enjoyment and recreation rather than a serious or practical purpose"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
)
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>"
)
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
)
.persist();
