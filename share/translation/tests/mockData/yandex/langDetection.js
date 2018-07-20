"use strict";

var mockTranslationData = require("./translation"),
    detectedLang = "en";

module.exports = {
    //general data
    text: mockTranslationData.text,
    detectedLang: detectedLang,
    apiKey: mockTranslationData.apiKey,
    keyInvalid: mockTranslationData.keyInvalid,
    keyBlocked: mockTranslationData.keyBlocked,
    limitExceeded: mockTranslationData.limitExceeded,
    //responses
    noError: {
        "code": 200,
        "lang": detectedLang
    },
    cannotDetect: {
        "code": 200,
        "lang": ""
    }
};
