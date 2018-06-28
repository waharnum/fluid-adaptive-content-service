"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var nlp = require("compromise");//npm package that provides NLP services

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.contractTests.tags");

adaptiveContentService.tests.nlp.compromise.contractTests.tags = function (sentence) {
    var sentenceData = nlp(sentence);
    var tagsData = sentenceData.out("tags");

    //Check that the data provided by the 'compromise' package matches the expected structure
    var responseObject = tagsData[0];

    var expectedResponseCondition = responseObject.hasOwnProperty("text") && responseObject.hasOwnProperty("tags");

    jqunit.assertTrue("Contract Test : For Sentence Tagging (Compromise Service) : Successful", expectedResponseCondition);
};

var testSentence = "Hello world";

jqunit.test(
    "Contract Test : For Sentence Tagging (Compromise Service)",
    function () {
        adaptiveContentService.tests.nlp.compromise.contractTests.tags(testSentence);
    }
);
