"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkLanguageCodes");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkLanguageCodes = function (testMessage, expectedReturnVal, sourceLang, testTargetLang) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.translateText.checkLanguageCodes(sourceLang, testTargetLang);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

//mock data
var mockTranslationData = require("../../mockData/yandex/translation");

var expectedReturnVal = {
    sourceLangInvalid: {
        statusCode: 404,
        errorMessage: "Invalid 'sourceLang' parameter - Please check the language code"
    },
    targetLangInvalid: {
        statusCode: 404,
        errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
    },
    bothValid: false
};

var testMessage = {
    sourceLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid sourceLang",
    targetLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid targetLang",
    bothValid: "Unit Test : For checkLanguageCodes function : Successful with both sourceLang and targetLang valid"
};

jqunit.test(
    "Unit Test : For checkLanguageCodes function (Translation Service)",
    function () {

        // for invalid sourceLang
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.sourceLangInvalid, expectedReturnVal.sourceLangInvalid, mockTranslationData.sourceLang.invalid, mockTranslationData.targetLang.correct);

        // for invalid targetLang
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.targetLangInvalid, expectedReturnVal.targetLangInvalid, mockTranslationData.sourceLang.correct, mockTranslationData.targetLang.invalid);

        // for both sourceLang and targetLang valid
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.bothValid, expectedReturnVal.bothValid, mockTranslationData.sourceLang.correct, mockTranslationData.targetLang.correct);
    }
);
