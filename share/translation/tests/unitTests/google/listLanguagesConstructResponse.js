"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.google.listLanguagesConstructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.google.listLanguagesConstructResponse = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.google.listLanguages.constructResponse(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockListLangData = require("../../mockData/google/listLanguages");

var testServiceResponse = {
    body: mockListLangData.languageArray
};

var expectedReturnVal = {
    languageCodes: mockListLangData.languageArray
};

var testMessage = "Unit Test : For list supported languages constructResponse function : Successful";

jqunit.test(
    "Unit Test : For list supported languages constructResponse function (Translation Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.google.listLanguagesConstructResponse(testMessage, expectedReturnVal, testServiceResponse);
    }
);
