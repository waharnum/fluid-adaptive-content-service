"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");
require("../../../../testUtils");

var testWord = "play";
var testMessage = {
    frequency: "Unit Test : For constructResponse function of frequency endpoint : Successful (Oxford Service)",
    extendedFrequency: "Unit Test : For constructResponse function of extended frequency endpoint : Successful (Oxford Service)" 
};
var constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse; //from oxfordHandlers.js

// mock service data
var jsonServiceData = {
    frequency: {
        result: {
            frequency: 1,
            lemma: testWord
        }
    },
    extendedFrequency: {
        result: {
            frequency: 1,
            lemma: testWord,
            lexicalCategory: "noun"
        }
    }
};

// expected return value from the function being tested
var expectedReturnVal = {
    frequency: {
        word: testWord,
        frequency: 1
    },
    extendedFrequency: {
        word: testWord,
        frequency: 1,
        lexicalCategory: "noun"
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
