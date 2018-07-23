"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testMessage = "Unit Test : For constructResponse function of antonyms endpoint : Successful (Oxford Service)",
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse; //from oxfordHandlers.js

// mock service data
var mockAntonymsData = require("../../mockData/oxford/antonyms"), // file holding object with mock data
    jsonServiceData = mockAntonymsData.correctWord;

// expected return value from the function being tested
var expectedReturnVal = {
    word: mockAntonymsData.word.correct,
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
        },
        {
            category: "Verb",
            senses: [
                {
                    examples: [],
                    antonyms: [ "mock antonym 3" ]
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
