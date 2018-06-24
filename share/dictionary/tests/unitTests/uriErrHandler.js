"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.unitTests.uriErrHandler");

require("../../../../v1/dictionary/handlers");

var testWords = {
    shortWord: "short",
    longWord: "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
};

adaptiveContentService.tests.dictionary.unitTests.uriErrHandler.uriShort = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.uriErrHandler(null, null, testWords.shortWord, null, null);

    jqunit.assertEquals("Unit Test : For uriErrHandler function : Successful with short uri", false, returnVal);
};

adaptiveContentService.tests.dictionary.unitTests.uriErrHandler.uriLong = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.uriErrHandler(null, null, testWords.longWord, null, null);

    jqunit.assertEquals("Unit Test : For uriErrHandler function : Successful with long uri", true, returnVal);
};

jqunit.test(
    "Unit Test : For uriErrHandler function (Dictionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.unitTests.uriErrHandler.uriShort();
        adaptiveContentService.tests.dictionary.unitTests.uriErrHandler.uriLong();
    }
);
