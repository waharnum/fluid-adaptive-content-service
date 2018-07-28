"use strict";

var commonOxfordSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["response", "jsonBody", "body"],
        "properties": {
            "response": {
                "$ref": "/schemas/oxfordResponseProperty.json"
            },
            "body": {"type": "string"},
            "jsonBody": {
                "type": "object",
                "required": ["results"],
                "properties": {
                    "results": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["type", "sourceLanguage"],
                            "properties": {
                                "type": { "type": "string" },
                                "sourceLanguage": {
                                    "type": "object",
                                    "required": ["id", "language"],
                                    "properties": {
                                        "id": { "type": "string" },
                                        "language": { "type": "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    authError: commonOxfordSchemas.errorSchema
};
