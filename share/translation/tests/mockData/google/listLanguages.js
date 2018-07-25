"use strict";

var googleMockTranslationData = require("./translation");

module.exports = {
    langParam: "fr",
    languageArray: {
        // in french
        french: [
            {
                language: "en",
                name: "Anglais"
            },
            {
                language: "de",
                name: "Allemand"
            }
        ],
        // in english
        english: [
            {
                language: "en",
                name: "English"
            },
            {
                language: "de",
                name: "German"
            }
        ]
    },
    apiKey: googleMockTranslationData.apiKey,
    // responses
    noError: {
        // in french
        french: [
            {
                code: "en",
                name: "Anglais"
            },
            {
                code: "de",
                name: "Allemand"
            }
        ],
        // in english
        english: [
            {
                code: "en",
                name: "Anglais"
            },
            {
                code: "de",
                name: "Allemand"
            }
        ]
    }
};
