"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["code", "lang"],
        "properties": {
            "code": { "type": "number" },
            "lang": { "type": "string" }
        }
    },
    error: commonSchemas.error,
    cannotDetect: {
        "type": "object",
        "required": ["code", "lang"],
        "properties": {
            "code": { "type": "number" },
            "lang": {
                "type": "string",
                "maxLength": 0
            }
        }
    }
};
