"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError");

require("../../../../v1/nlp/handlers");

var characterLimit = 30;

var requestSentence = {
    correctSentence: "This is correct sentence",
    longSentence: "This is a long statement, exceeding character limit",
    emptySentence: ""
};

adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.correctSentence = function () {
    var returnVal = adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError(requestSentence.correctSentence, characterLimit);

    jqunit.assertEquals("Unit Test : For checkNlpError function : Successful with correct sentence", undefined, returnVal);
};

adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.longSentence = function () {
    var returnVal = adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError(requestSentence.longSentence, characterLimit);

    jqunit.assertEquals("Unit Test : For checkNlpError function : Successful with long sentence", 413, returnVal.statusCode);
};

adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.emptySentence = function () {
    var returnVal = adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError(requestSentence.emptySentence, characterLimit);

    jqunit.assertEquals("Unit Test : For checkNlpError function : Successful with empty sentence", 400, returnVal.statusCode);
};

jqunit.test(
    "Unit Test : For checkNlpError function (Compromise Service)",
    function () {
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.correctSentence();
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.longSentence();
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError.emptySentence();
    }
);
