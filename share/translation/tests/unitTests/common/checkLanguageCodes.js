"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkLanguageCodes");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkLanguageCodes = function (testMessage, expectedReturnVal, testLangObj) {
    var returnVal = adaptiveContentService.handlers.translation.checkLanguageCodes(testLangObj);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

//mock data
var mockTranslationData = require("../../mockData/yandex/translation");

var langObjs = {
    absent: false,
    sourceLangInvalid: {
        source: {
            name: "sourceLang",
            value: mockTranslationData.sourceLang.invalid
        }
    },
    targetLangInvalid: {
        target: {
            name: "targetLang",
            value: mockTranslationData.targetLang.invalid
        }
    },
    bothValid: {
        source: {
            name: "sourceLang",
            value: mockTranslationData.sourceLang.correct
        },
        target: {
            name: "targetLang",
            value: mockTranslationData.targetLang.correct
        }
    }
};

var expectedReturnVal = {
    langObjAbsent: false,
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
    langObjAbsent: "Unit Test : For checkLanguageCodes function : Successful with langObj absent",
    sourceLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid sourceLang",
    targetLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid targetLang",
    bothValid: "Unit Test : For checkLanguageCodes function : Successful with both sourceLang and targetLang valid"
};

jqunit.test(
    "Unit Test : For checkLanguageCodes function (Translation Service)",
    function () {

        // for absent langObj
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.langObjAbsent, expectedReturnVal.langObjAbsent, langObjs.absent);

        // for invalid sourceLang
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.sourceLangInvalid, expectedReturnVal.sourceLangInvalid, langObjs.sourceLangInvalid);

        // for invalid targetLang
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.targetLangInvalid, expectedReturnVal.targetLangInvalid, langObjs.targetLangInvalid);

        // for both sourceLang and targetLang valid
        adaptiveContentService.tests.translation.unitTests.checkLanguageCodes(testMessage.bothValid, expectedReturnVal.bothValid, langObjs.bothValid);
    }
);
