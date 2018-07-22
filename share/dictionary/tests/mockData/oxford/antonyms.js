"use strict";

var commonOxfordMockData = require("./commonMockData");

module.exports = function (correctWord, wrongWord) {
    return {
        // general data
        apiKeys: commonOxfordMockData.apiKeys,
        // responses
        correctWord:
        {
            results: [
                {
                    id: correctWord,
                    lexicalEntries: [
                        {
                            lexicalCategory: "Noun",
                            entries: [
                                {
                                    senses: [
                                        {
                                            antonyms: [
                                                {
                                                    text: "mock antonym 1"
                                                }
                                            ],
                                            examples: [
                                                {
                                                    text: "mock example 1"
                                                }
                                            ],
                                            subsenses: [
                                                {
                                                    antonyms: [
                                                        {
                                                            text: "mock antonym 2"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            lexicalCategory: "Verb",
                            entries: [
                                {
                                    senses: [
                                        {
                                            antonyms: [
                                                {
                                                    text: "mock antonym 3"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        wrongWord: "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for '" + wrongWord + "' in 'en'</p>",
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>",
        authError: "Authentication failed"
    };
};
