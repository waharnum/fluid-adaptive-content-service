"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.langDetectionConstructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.langDetectionConstructResponse = function (testMessage, expectedReturnVal, serviceResponse, sourceText) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.langDetection.constructResponse(serviceResponse, sourceText);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

//mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

var testServiceResponse = {
    body: mockLangDetectionData.noError
};

var expectedReturnVal = {
    sourceText: mockLangDetectionData.text.noError,
    langCode: mockLangDetectionData.detectedLang
};

var testMessage = "Unit Test : For langDetectionConstructResponse function : Successful";

jqunit.test(
    "Unit Test : For translation langDetectionConstructResponse function (Translation Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.langDetectionConstructResponse(testMessage, expectedReturnVal, testServiceResponse, mockLangDetectionData.text.noError);
    }
);