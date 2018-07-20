"use strict";

module.exports = {
    authError: {
        "$id": "/schemas/googleAuthError.json",
        "type": "object",
        "required": ["error"],
        "properties": {
            "error": {
                "type": "object",
                "required": ["code"],
                "properties": {
                    "code": { "type": "number" }
                }
            }
        }
    }
};
