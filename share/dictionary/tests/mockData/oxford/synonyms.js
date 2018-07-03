"use strict";

module.exports = function (correctWord, wrongWord) {
    return {
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
                                            synonyms: [
                                                {
                                                    text: "mock synonym 1"
                                                }
                                            ],
                                            examples: [
                                                {
                                                    text: "mock example 1"
                                                }
                                            ],
                                            subsenses: [
                                                {
                                                    synonyms: [
                                                        {
                                                            text: "mock synonym 2"
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
                                            synonyms: [
                                                {
                                                    text: "mock synonym 3"
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
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
    };
};
