"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.constructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.constructResponse = function (testMessage, expectedReturnVal, serviceResponse, sourceLang, targetLang, sourceText) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.translateText.constructResponse(serviceResponse, sourceLang, targetLang, sourceText);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var testSourceLang = "en",
    testTargetLang = "de",
    testText = "This is the text to be translated";

//mock data
var mockTranslationData = require("../../mockData/yandex/translation")(testSourceLang, testTargetLang);

var testServiceResponse = {
    body: mockTranslationData.noError
};

var expectedReturnVal = {
    sourceLang: testSourceLang,
    targetLang: testTargetLang,
    sourceText: testText,
    translatedText: testServiceResponse.body.text
};

var testMessage = "Unit Test : For constructResponse function : Successful";

jqunit.test(
    "Unit Test : For constructResponse function (Translation Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.constructResponse(testMessage, expectedReturnVal, testServiceResponse, testSourceLang, testTargetLang, testText);
    }
);
