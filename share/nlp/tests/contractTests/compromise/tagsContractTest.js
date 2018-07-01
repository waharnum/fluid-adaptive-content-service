"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var nlp = require("compromise");//npm package that provides NLP services

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.contractTests.tags");

var tagsSchemas = require("./schemas/tagsSchemas"); //main schema that is compiled
var allSchemas = []; //array of all schemas required (other than main schema)

var successMessage = "Contract Test : For sentence tagging successful (Compromise Service)";
var failureMessage = "Contract Test : For sentence tagging failed (Compromise Service)";

adaptiveContentService.tests.nlp.compromise.contractTests.tags = function (sentence) {
    var sentenceData = nlp(sentence);
    var tagsData = sentenceData.out("tags");

    adaptiveContentService.tests.utils.contractTestHandler(tagsData, tagsSchemas, allSchemas, successMessage, failureMessage);
};

var testSentence = "Hello world";
jqunit.test(
    "Contract Test : For Sentence Tagging (Compromise Service)",
    function () {
        adaptiveContentService.tests.nlp.compromise.contractTests.tags(testSentence);
    }
);
