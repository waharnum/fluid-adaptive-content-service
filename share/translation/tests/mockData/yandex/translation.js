"use strict";

module.exports = function (sourceLang, targetLang) {
    return {
        noError: {
            "code": 200,
            "lang": sourceLang + "-" + targetLang,
            "text": [ "Dies ist der text, der übersetzt werden" ]
        },
        keyInvalid: {
            "code": 401,
            "message": "API key is invalid"
        },
        keyBlocked: {
            "code": 402,
            "message": "API key is blocked"
        },
        limitExceeded: {
            "code": 404,
            "message": "Exceeded the daily limit on the amount of translated text"
        },
        unsupportedTranslation: {
            "code": 501,
            "message": "The specified translation direction is not supported"
        },
        invalidLangCode: {
            "code": 502,
            "message": "Invalid 'lang' parameter"
        }
    };
};
