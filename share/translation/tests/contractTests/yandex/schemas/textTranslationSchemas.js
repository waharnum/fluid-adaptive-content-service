"use strict";

module.exports = {
    noError: {
        "type": "object",
        "required": ["code", "text"],
        "properties": {
            "code": { "type": "number" },
            "text": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    },
    error: {
        "type": "object",
        "required": ["code", "message"],
        "properties": {
            "code": { "type": "number"},
            "message": { "type": "string" }
        }
    }
};
