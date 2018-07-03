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
var mockDefinitionsData = require("../../mockData/oxford/definitions")(testWord, null);// file holding object with mock data
var jsonServiceData = mockDefinitionsData.correctWord;

// expected return value from the function being tested
var expectedReturnVal = {
    word: testWord,
    entries: [
        {
            category: "Verb",
            definitions: [
                "mock definition 1",
                "mock definition 2",
                "mock definition 3",
                "mock definition 4"
            ]
        },
        {
            category: "Noun",
            definitions: [
                "mock definition 5"
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
