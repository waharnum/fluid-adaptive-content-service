"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testWord = "play";
var testFrequency = 123;
var testLexicalCategory = "noun";
var testMessage = {
    frequency: "Unit Test : For constructResponse function of frequency endpoint : Successful (Oxford Service)",
    extendedFrequency: "Unit Test : For constructResponse function of extended frequency endpoint : Successful (Oxford Service)"
};
var constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse; //from oxfordHandlers.js

// mock service data
var mockFrequencyData = require("../../mockData/oxford/frequency")(testWord, testFrequency);// file holding object with mock data (frequency)
var mockExtendedFrequencyData = require("../../mockData/oxford/extendedFrequency")(testWord, testFrequency, testLexicalCategory);// file holding object with mock data
var jsonServiceData = {
    frequency: mockFrequencyData.correctWord,
    extendedFrequency: mockExtendedFrequencyData.correctWord
};

// expected return value from the function being tested
var expectedReturnVal = {
    frequency: {
        word: testWord,
        frequency: testFrequency
    },
    extendedFrequency: {
        word: testWord,
        frequency: testFrequency,
        lexicalCategory: testLexicalCategory
    }
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of frequency and extended frequency endpoint (Oxford Service)",
    function () {

        //for frequency endpoint
        testFunction(constructResponseFunction, jsonServiceData.frequency, expectedReturnVal.frequency, testMessage.frequency);

        //for extended frequency endpoint
        testFunction(constructResponseFunction, jsonServiceData.extendedFrequency, expectedReturnVal.extendedFrequency, testMessage.extendedFrequency);
    }
);
