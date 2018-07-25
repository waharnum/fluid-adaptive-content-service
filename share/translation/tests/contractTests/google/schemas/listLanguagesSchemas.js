"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "array",
        "items": {
            "type": "object",
            "required": ["language", "name"],
            "properties": {
                "language": { "type": "string" },
                "name": { "type": "string" }
            }
        }
    },
    authError: commonSchemas.authError
};
