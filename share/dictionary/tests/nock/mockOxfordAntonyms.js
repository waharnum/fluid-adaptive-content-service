"use strict";

var nock = require("nock");
var correctWord = "play",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord + "/antonyms")
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
                                        antonyms: [
                                            {
                                                text: "work"
                                            }
                                        ],
                                        examples: [
                                            {
                                                text: "one must strike a balance between work and play"
                                            }
                                        ],
                                        subsenses: [
                                            {
                                                antonyms: [
                                                    {
                                                        text: "random word"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        lexicalCategory: "Noun"
                    }
                ]
            }
        ]
    }
)
.get("/entries/" + correctLang + "/" + wrongWord + "/antonyms")
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>"
)
.get("/entries/" + wrongLang + "/" + correctWord + "/antonyms")
.reply(
    404,
    "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
)
.persist();
