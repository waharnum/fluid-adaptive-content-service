"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testWord = "word";
var testMessage = "Unit Test : For constructResponse function of pronunciations endpoint : Successful (Oxford Service)";
var constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.pronunciations.constructResponse; //from oxfordHandlers.js

// mock service data
var jsonServiceData = {
    results: [
        {
            id: testWord,
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
                }
            ]
        }
    ]
};

// expected return value from the function being tested
var expectedReturnVal = {
    word: testWord,
    entries: [
        {
            category: "",
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
        },
        {
            category: "Noun",
            pronunciations: [
                {
                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                    "dialects": [
                        "British English"
                    ],
                    "phoneticNotation": "IPA",
                    "phoneticSpelling": "bɑːθ"
                },
                {
                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                    "dialects": [
                        "British English"
                    ],
                    "phoneticNotation": "IPA",
                    "phoneticSpelling": "bɑːθ"
                },
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
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of pronunciations endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
