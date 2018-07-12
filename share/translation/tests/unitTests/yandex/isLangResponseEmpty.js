"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.langDetection.isLangResponseEmpty");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.langDetection.isLangResponseEmpty = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.langDetection.isLangResponseEmpty(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

var testSeviceResponse = {
    noError: {
        statusCode: mockLangDetectionData.noError.code,
        body: mockLangDetectionData.noError
    },
    cannotDetect: {
        statusCode: mockLangDetectionData.cannotDetect.code,
        body: mockLangDetectionData.cannotDetect
    }
};

var expectedReturnVal = {
    noError: false,
    cannotDetect: {
        statusCode: 404,
        errorMessage: "Language could not be detected from the text provided"
    }
};

var testMessage = {
    noError: "Unit Test : For isLangResponseEmpty function : Successful with 'no error' response",
    cannotDetect: "Unit Test : For isLangResponseEmpty function : Successful with 'unable to detect lang' response"
};

jqunit.test(
    "Unit Test : For isLangResponseEmpty function (Translation Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.langDetection.isLangResponseEmpty(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'unable to detect lang' response
        adaptiveContentService.tests.translation.unitTests.langDetection.isLangResponseEmpty(testMessage.cannotDetect, expectedReturnVal.cannotDetect, testSeviceResponse.cannotDetect);
    }
);
