"use strict";

var mockTranslationData = require("./translation"),
    detectedLang = "en";

module.exports = {
    //general data
    text: mockTranslationData.text,
    detectedLang: detectedLang,
    noError: {
        "code": 200,
        "lang": detectedLang
    },
    apiKey: mockTranslationData.apiKey,
    keyInvalid: mockTranslationData.keyInvalid,
    keyBlocked: mockTranslationData.keyBlocked,
    limitExceeded: mockTranslationData.limitExceeded,
    //responses
    cannotDetect: {
        "code": 200,
        "lang": ""
    }
};
