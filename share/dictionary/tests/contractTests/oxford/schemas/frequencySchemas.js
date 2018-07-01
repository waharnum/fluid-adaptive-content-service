"use strict";

module.exports = {
    correctWord: {
        "$id": "/schemas/frequencyCorrectWord.json",
        "type": "object",
        "required": ["response", "body", "jsonBody"],
        "properties": {
            "response": {
                "$ref": "/schemas/oxfordResponseProperty.json"
            },
            "body": {"type": "string"},
            "jsonBody": {
                "type": "object",
                "required": ["result"],
                "properties": {
                    "result": {
                        "type": "object",
                        "required": ["lemma", "frequency"],
                        "properties": {
                            "lemma": { "type": "string" },
                            "frequency": { "type": "number" }
                        }
                    }
                }
            }
        }
    },
    wrongLang: {
        "$ref": "/schemas/commonOxfordErrorSchema.json"
    }
};

/*
 * No wrong word test here
 * because the frequency is returned 0 for them
 */
