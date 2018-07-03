"use strict";

module.exports = function (correctWord, wrongWord) {
    return {
        correctWord:
        {
            results: [
                {
                    id: correctWord,
                    pronunciations: [
                        {
                            "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                            "dialects": [
                                "British English"
                            ],
                            "phoneticNotation": "IPA",
                            "phoneticSpelling": "bɑːθ"
                        }
                    ],
                    lexicalEntries: [
                        {
                            lexicalCategory: "Noun",
                            pronunciations: [
                                {
                                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                                    "dialects": [
                                        "British English"
                                    ],
                                    "phoneticNotation": "IPA",
                                    "phoneticSpelling": "bɑːθ"
                                }
                            ],
                            entries: [
                                {
                                    pronunciations: [
                                        {
                                            "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                                            "dialects": [
                                                "British English"
                                            ],
                                            "phoneticNotation": "IPA",
                                            "phoneticSpelling": "bɑːθ"
                                        }
                                    ],
                                    senses: [
                                        {
                                            pronunciations: [
                                                {
                                                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                                                    "dialects": [
                                                        "British English"
                                                    ],
                                                    "phoneticNotation": "IPA",
                                                    "phoneticSpelling": "bɑːθ"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            lexicalCategory: "Verb",
                            pronunciations: [
                                {
                                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                                    "dialects": [
                                        "British English"
                                    ],
                                    "phoneticNotation": "IPA",
                                    "phoneticSpelling": "bɑːθ"
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
