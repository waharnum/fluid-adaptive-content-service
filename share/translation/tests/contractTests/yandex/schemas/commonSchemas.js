"use strict";

module.exports = {
    error: {
        "type": "object",
        "required": ["code", "message"],
        "properties": {
            "code": { "type": "number"},
            "message": { "type": "string" }
        }
    }
};
