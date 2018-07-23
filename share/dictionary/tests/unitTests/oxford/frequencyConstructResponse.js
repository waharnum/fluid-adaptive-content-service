"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testMessage = {
        frequency: "Unit Test : For constructResponse function of frequency endpoint : Successful (Oxford Service)",
        extendedFrequency: "Unit Test : For constructResponse function of extended frequency endpoint : Successful (Oxford Service)"
    },
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse; //from oxfordHandlers.js

// mock service data
var mockFrequencyData = require("../../mockData/oxford/frequency"), //file holding object with mock data (frequency)
    mockExtendedFrequencyData = require("../../mockData/oxford/extendedFrequency"),// file holding object with mock data
    jsonServiceData = {
        frequency: mockFrequencyData.correctWord,
        extendedFrequency: mockExtendedFrequencyData.correctWord
    };

// expected return value from the function being tested
var expectedReturnVal = {
    frequency: {
        word: mockFrequencyData.word.correct,
        frequency: mockFrequencyData.frequency
    },
    extendedFrequency: {
        word: mockExtendedFrequencyData.word.correct,
        frequency: mockExtendedFrequencyData.frequency,
        lexicalCategory: mockExtendedFrequencyData.lexicalCategory
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
