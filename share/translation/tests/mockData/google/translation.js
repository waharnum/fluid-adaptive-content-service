"use strict";

var kettle = require("kettle");

var commonMockTranslationData = require("../common/translation");

module.exports = {
    // general data
    text: commonMockTranslationData.text,
    sourceLang: commonMockTranslationData.sourceLang,
    targetLang: commonMockTranslationData.targetLang,
    apiKey: {
        correct: kettle.resolvers.env("GOOGLE_API_KEY"),
        invalid: "randomstring",
        blocked: "blockedkey" //not actually blocked; used for mock response only
    },
    // responses
    noError: {
        "detectedSourceLanguage": commonMockTranslationData.sourceLang.correct,
        "originalText": commonMockTranslationData.text.noError,
        "translatedText": "Dies ist der zu übersetzende Text"
    },
    keyInvalid: {
        "body": {
            "error": {
                "code": 400,
                "message": "API key not valid. Please pass a valid API key."
            }
        }
    },
    invalidLangCode: {
        "body": {
            "error": {
                "code": 400,
                "message": "Invalid Value"
            }
        }
    }
};
