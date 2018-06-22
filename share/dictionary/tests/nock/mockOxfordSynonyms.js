"use strict";

var nock = require("nock");
var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord + "/synonyms")
.reply(
        200,
    {
        results: [
            {
                id: "play",
                lexicalEntries: [
                    {
                        entries: [
                            {
                                senses: [
                                    {
                                        synonyms: [
                                            {
                                                text: "amuse oneself"
                                            }
                                        ],
                                        examples: [
                                            {
                                                text: "the children were playing with toys on the floor"
                                            }
                                        ],
                                        subsenses: [
                                            {
                                                synonyms: [
                                                    {
                                                        text: "mess about"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        lexicalCategory: "Verb"
                    }
                ]
            }
        ]
    }
)
.get("/entries/" + correctLang + "/" + wrongWord + "/synonyms")
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>"
)
.get("/entries/" + wrongLang + "/" + correctWord + "/synonyms")
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
);
