"use strict";

var commonOxfordSchemas = require("./commonSchemas");

module.exports = {
    correctWord: {
        "type": "object",
        "required": ["response", "body", "jsonBody"],
        "properties": {
            "response": {
                "$ref": "/schemas/oxfordResponseProperty.json"
            },
            "body": {"type": "string"},
            "jsonBody": {
                "$patch": {
                    "source": {
                        "$ref": "/schemas/commonOxford.json"
                    },
                    "with": [
                        {
                            "op": "add",
                            "path": "/properties/results/items/properties/lexicalEntries/items/properties/entries",
                            "value": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "pronunciations": {
                                            "type": "array"
                                        },
                                        "senses": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "pronunciations": {
                                                        "type": "array"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            "op": "add",
                            "path": "/properties/results/items/properties/pronunciations",
                            "value": {
                                "type": "array"
                            }
                        },
                        {
                            "op": "add",
                            "path": "/properties/results/items/properties/lexicalEntries/items/properties/pronunciations",
                            "value": {
                                "type": "array"
                            }
                        }
                    ]
                }
            }
        }
    },
    wrongWord: commonOxfordSchemas.errorSchema,
    wrongLang: commonOxfordSchemas.errorSchema
};
