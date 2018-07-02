"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testWord = "word";
var testMessage = "Unit Test : For constructResponse function of definitions endpoint : Successful (Oxford Service)";
var constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.definition.constructResponse; //from oxfordHandlers.js

// mock service data
var jsonServiceData = {
    results: [
        {
            id: testWord,
            lexicalEntries: [
                {
                    lexicalCategory: "Verb",
                    entries: [
                        {
                            senses: [
                                {
                                    definitions: [
                                        "mock definition 1"
                                    ],
                                    subsenses: [
                                        {
                                            definitions: [
                                                "mock definition 2"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    definitions: [
                                        "mock definition 3"
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
            category: "Verb",
            definitions: [
                "mock definition 1",
                "mock definition 2",
                "mock definition 3"
            ]
        }
    ]
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of definitions endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
