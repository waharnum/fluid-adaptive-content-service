"use strict";

var commonMockTranslationData = require("../common/translation"),
    googleMockTranslationData = require("./translation"),
    detectedLang = "en";

module.exports = {
    //general data
    text: commonMockTranslationData.text,
    detectedLang: detectedLang,
    apiKey: googleMockTranslationData.apiKey,
    //responses
    noError: {
        "originalText": commonMockTranslationData.text.noError,
        "language": detectedLang
    },
    cannotDetect: {
        "language": "und"
    },
    keyInvalid: googleMockTranslationData.keyInvalid,
    requestError: googleMockTranslationData.requestError
};
