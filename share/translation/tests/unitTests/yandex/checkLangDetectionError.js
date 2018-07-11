"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkLangDetectionError");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkLangDetectionError = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.translateText.checkLangDetectionError(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockTranslationData = require("../../mockData/yandex/translation");

var testSeviceResponse = {
    noError: {
        statusCode: mockTranslationData.noError.code,
        body: mockTranslationData.noError
    },
    keyInvalid: {
        statusCode: mockTranslationData.keyInvalid.code,
        body: mockTranslationData.keyInvalid
    },
    limitExceeded: {
        statusCode: mockTranslationData.limitExceeded.code,
        body: mockTranslationData.limitExceeded
    },
    unsupportedTranslation: {
        statusCode: mockTranslationData.unsupportedTranslation.code,
        body: mockTranslationData.unsupportedTranslation
    },
    keyBlocked: {
        statusCode: mockTranslationData.keyBlocked.code,
        body: mockTranslationData.keyBlocked
    }
};

var expectedReturnVal = {
    noError: false,
    keyInvalid: {
        statusCode: 403,
        errorMessage: "Authenticaion failed - " + testSeviceResponse.keyInvalid.body.message
    },
    limitExceeded: {
        statusCode: 429,
        errorMessage: testSeviceResponse.limitExceeded.body.message
    },
    unsupportedTranslation: {
        statusCode: 404,
        errorMessage: testSeviceResponse.unsupportedTranslation.body.message + " - Please check the language codes"
    },
    keyBlocked: {
        statusCode: testSeviceResponse.keyBlocked.statusCode,
        errorMessage: testSeviceResponse.keyBlocked.body.message
    }
};

var testMessage = {
    noError: "Unit Test : For checkLangDetectionError function : Successful with 'no error' response",
    keyInvalid: "Unit Test : For checkLangDetectionError function : Successful with 'invalid key' response",
    limitExceeded: "Unit Test : For checkLangDetectionError function : Successful with 'limit exceeded' response",
    unsupportedTranslation: "Unit Test : For checkLangDetectionError function : Successful with 'unsupported translation' response",
    keyBlocked: "Unit Test : For checkLangDetectionError function : Successful with 'blocked key' response"
};

jqunit.test(
    "Unit Test : For checkLangDetectionError function (Translation Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.checkLangDetectionError(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'invalid key' response
        adaptiveContentService.tests.translation.unitTests.checkLangDetectionError(testMessage.keyInvalid, expectedReturnVal.keyInvalid, testSeviceResponse.keyInvalid);

        // for 'limit exceeded' response
        adaptiveContentService.tests.translation.unitTests.checkLangDetectionError(testMessage.limitExceeded, expectedReturnVal.limitExceeded, testSeviceResponse.limitExceeded);

        // for 'unsupported translation' response
        adaptiveContentService.tests.translation.unitTests.checkLangDetectionError(testMessage.unsupportedTranslation, expectedReturnVal.unsupportedTranslation, testSeviceResponse.unsupportedTranslation);

        // for 'blocked key' response
        adaptiveContentService.tests.translation.unitTests.checkLangDetectionError(testMessage.keyBlocked, expectedReturnVal.keyBlocked, testSeviceResponse.keyBlocked);
    }
);
