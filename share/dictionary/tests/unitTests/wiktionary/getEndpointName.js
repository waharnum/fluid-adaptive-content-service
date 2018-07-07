"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.unitTests.getEndpointName");

require("../../../../../v1/dictionary/handlers/wiktionaryHandlers");

var testUrl = "/version/dictionary/wiktionary/language/serviceName/word";

adaptiveContentService.tests.dictionary.wiktionary.unitTests.getEndpointName = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.getEndpointName(testUrl);

    jqunit.assertEquals("Unit Test : For getEndpointName function : Successful", "serviceName", returnVal);
};

jqunit.test(
    "Unit Test : For getEndpointName function (Dictionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.getEndpointName();
    }
);