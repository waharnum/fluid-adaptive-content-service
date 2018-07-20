"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["detectedSourceLanguage", "originalText", "translatedText"],
        "properties": {
            "detectedSourceLanguage": { "type": "string" },
            "originalText": { "type": "string" },
            "translatedText": { "type": "string" }
        }
    },
    authError: commonSchemas.authError,
    langError: {
        "$id": "/schemas/googleAuthError.json",
        "type": "object",
        "required": ["error"],
        "properties": {
            "error": {
                "type": "object",
                "required": ["message"],
                "properties": {
                    "message": { "type": "string" }
                }
            }
        }
    }
}