"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.unitTests.constructResponse");

require("../../../../../v1/dictionary/handlers/wiktionaryHandlers");

var jsonServiceData = {
    word: "word",
    category: "noun",
    definition: "The smallest unit of language that has a particular meaning and can be expressed by itself; the smallest discrete, meaningful unit of language."
};

adaptiveContentService.tests.dictionary.unitTests.constructResponse = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse(jsonServiceData);

    var expectedReturnVal = {
        word: "word",
        entries: [
            {
                category: "noun",
                definitions: [
                    "The smallest unit of language that has a particular meaning and can be expressed by itself; the smallest discrete, meaningful unit of language."
                ]
            }
        ]
    };

    jqunit.assertDeepEq("Unit Test : For constructResponse function : Successful", expectedReturnVal, returnVal);
};

jqunit.test(
    "Unit Test : For constructResponse function (Dictionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.unitTests.constructResponse();
    }
);
