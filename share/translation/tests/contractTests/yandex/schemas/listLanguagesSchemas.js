"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "required": ["langs"],
        "properties": {
            "langs": {
                "type": "object"
            }
        }
    },
    error: commonSchemas.error,
};
