"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError");

require("../../../../../v1/dictionary/handlers/wiktionaryHandlers");

var serviceResponse = {
    noError: {
        word: "word",
        category: "noun",
        definition: "The smallest unit of language that has a particular meaning and can be expressed by itself; the smallest discrete, meaningful unit of language."
    },
    wrongWord: {
        word: "wrongWord",
        err: "not found"
    },
    wrongLang: {
        word: "word",
        err: "unsupported language"
    },
    otherErrors: {
        word: "word",
        err: "any other error"
    }
};

// fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

// kettle.loadTestingSupport();

// adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError = [{
//     name: "Unit Test : For checkDictionaryError function (Wiktionary Service)",
//     expect: 1,
//     sequence: [
//         {
//             func: "adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.noError"
//         }
//     ]
// }];

adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.noError = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError(serviceResponse.noError);

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with 'no error' response", undefined, returnVal);
};

adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.wrongWord = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError(serviceResponse.wrongWord);

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with 'wrong word' response", 404, returnVal.statusCode);
};

adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.wrongLang = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError(serviceResponse.wrongLang);

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with 'wrong language' response", 404, returnVal.statusCode);
};

adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.otherErrors = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError(serviceResponse.otherErrors);

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with any other response", 501, returnVal.statusCode);
};

jqunit.test(
    "Unit Test : For checkDictionaryError function (Wiktionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.noError();
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.wrongWord();
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.wrongLang();
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError.otherErrors();
    }
);
