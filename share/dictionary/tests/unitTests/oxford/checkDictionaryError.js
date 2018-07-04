"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");

var serviceResponse = {
    noError: {
        statusCode: 200
    },
    authFail: {
        statusCode: 403,
        body: "Authentication failed"
    },
    wrongWord: {
        statusCode: 404,
        body: "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>"
    },
    wrongLang: {
        statusCode: 404,
        body: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
    },
    unhandledError: {
        statusCode: 555, //random code that has not been handled
        body: ""
    }
};

var testMessage = {
    noError: "Unit Test : For checkDictionary function : Successful with 'no error' response",
    authFail: "Unit Test : For checkDictionary function : Successful with 'failed authentication' response",
    wrongWord: "Unit Test : For checkDictionary function : Successful with 'wrong word' response",
    wrongLang: "Unit Test : For checkDictionary function : Successful with 'wrong language' response",
    unhandledError: "Unit Test : For checkDictionary function : Successful with 'unhandled error' response"
};

var expectedReturnVal = {
    noError: undefined,
    authFail: 403,
    wrongWord: 404,
    wrongLang: 404,
    unhandledError: 501
};

adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError = function (serviceResponse, testMessage, expectedReturnVal) {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.checkDictionaryError(serviceResponse);

    if (returnVal) {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal.statusCode);
    }
    else {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
    }
};

jqunit.test(
    "Unit Test : For checkDictionaryError function (oxford Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.noError, testMessage.noError, expectedReturnVal.noError);

        // for 'failed authentication' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.authFail, testMessage.authFail, expectedReturnVal.authFail);

        // for 'wrong word' error response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.wrongWord, testMessage.wrongWord, expectedReturnVal.wrongWord);

        // for 'wrong lang' error response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.wrongLang, testMessage.wrongLang, expectedReturnVal.wrongLang);

        //for 'unhandled error' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.unhandledError, testMessage.unhandledError, expectedReturnVal.unhandledError);
    }
);
