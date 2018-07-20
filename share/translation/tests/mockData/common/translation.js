"use strict";

var kettle = require("kettle");

module.exports = {
    // general data
    text: {
        noError: "This is the text to be translated",
        empty: "",
        absent: undefined,
        tooLong: "This sentence will exceed the character limit because it is very long",
        numerical: "12345",
        limitExceeded: "This test will trigger limit exceeded endpoint"
    },
    sourceLang: {
        correct: "en",
        wrong: "eng",
        invalid: "english"
    },
    targetLang: {
        correct: "de",
        wrong: "ger",
        invalid: "german"
    },
    // responses
    requestError: {
        body: undefined
    }
}