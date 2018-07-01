"use strict";

module.exports = {
    "type": "array",
    "items": {
        "type": "object",
        "required": ["text", "tags"],
        "properties": {
            "text": {
                "type": "string"
            },
            "tags": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    }
};
