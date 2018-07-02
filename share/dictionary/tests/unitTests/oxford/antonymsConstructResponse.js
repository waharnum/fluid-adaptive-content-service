"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testWord = "word";
var testMessage = "Unit Test : For constructResponse function of antonyms endpoint : Successful (Oxford Service)";
var constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse; //from oxfordHandlers.js

// mock service data
var jsonServiceData =     {
    results: [
        {
            id: testWord,
            lexicalEntries: [
                {
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
                    ],
                    lexicalCategory: "Noun"
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
            category: "Noun",
            senses: [
                {
                    examples: ["mock example 1"],
                    antonyms: [
                        "mock antonym 1",
                        "mock antonym 2"
                    ]
                }
            ]
        }
    ]
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of antonyms endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
