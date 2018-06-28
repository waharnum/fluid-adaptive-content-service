"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.unitTests.checkWordLength");

require("../../../../../v1/dictionary/handlers");

adaptiveContentService.tests.dictionary.unitTests.checkWordLength = function (testMessage, expectedReturnVal, testWord, wordCharacterLimit) {
    var returnVal = adaptiveContentService.handlers.dictionary.checkWordLength(testWord, wordCharacterLimit);

    jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
};

var testWord = {
    shortWord: "short",
    longWord: "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
};

var testMessage = {
    shortWord: "Unit Test : For checkWordLength function : Successful with short word",
    longWord: "Unit Test : For checkWordLength function : Successful with long word"
};

var expectedReturnVal = {
    shortWord: true,
    longWord: false
};

var wordCharacterLimit = 128;

jqunit.test(
    "Unit Test : For checkWordLength function (Dictionary Service)",
    function () {

        // for short word
        adaptiveContentService.tests.dictionary.unitTests.checkWordLength(testMessage.shortWord, expectedReturnVal.shortWord, testWord.shortWord, wordCharacterLimit);

        // for long word
        adaptiveContentService.tests.dictionary.unitTests.checkWordLength(testMessage.longWord, expectedReturnVal.longWord, testWord.longWord, wordCharacterLimit);
    }
);
