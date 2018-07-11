"use strict";

var mockTranslationData = require("./translation");

module.exports = {
    text: mockTranslationData.text,
    detectedLang: "en",
    noError: {
        "code": 200,
        "lang": this.detectedLang
    },
    apiKey: mockTranslationData.apiKey,
    keyInvalid: mockTranslationData.keyInvalid,
    keyBlocked: mockTranslationData.keyBlocked,
    limitExceeded: mockTranslationData.limitExceeded
};
