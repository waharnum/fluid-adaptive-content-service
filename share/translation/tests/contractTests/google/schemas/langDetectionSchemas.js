"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["originalText", "language"],
        "properties": {
            "originalText": { "type": "string" },
            "language": { "type": "string" }
        }
    },
    authError: commonSchemas.authError,
    cannotDetect: {
        "type": "object",
        "required": ["language"],
        "properties": {
            "language": {
                "type": "string",
                "pattern": "und"
            }
        }
    }
};
