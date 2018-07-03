"use strict";

module.exports = {
    correctWord: {
        "$patch": {
            "source": {
                "$ref": "/schemas/frequencyCorrectWord.json"
            },
            "with": [
                {
                    "op": "add",
                    "path": "/properties/jsonBody/properties/result/properties/lexicalCategory",
                    "value": {
                        "type": "string"
                    }
                }
            ]
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

