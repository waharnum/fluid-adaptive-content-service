"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.unitTests.uriErrHandler");

require("../../../../v1/dictionary/handlers");

adaptiveContentService.tests.dictionary.unitTests.uriErrHandler = function (testMessage, expectedReturnVal, testWord) {
    var returnVal = adaptiveContentService.handlers.dictionary.uriErrHandler(null, null, testWord, null, null);

    jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
};

var testWord = {
    shortWord: "short",
    longWord: "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
};

var testMessage = {
    shortWord: "Unit Test : For uriErrHandler function : Successful with short uri",
    longWord: "Unit Test : For uriErrHandler function : Successful with long uri"
};

var expectedReturnVal = {
    shortWord: false,
    longWord: true
};

jqunit.test(
    "Unit Test : For uriErrHandler function (Dictionary Service)",
    function () {

        // for uri with short word
        adaptiveContentService.tests.dictionary.unitTests.uriErrHandler(testMessage.shortWord, expectedReturnVal.shortWord, testWord.shortWord);

        // for uri with long word
        adaptiveContentService.tests.dictionary.unitTests.uriErrHandler(testMessage.longWord, expectedReturnVal.longWord, testWord.longWord);
    }
);
