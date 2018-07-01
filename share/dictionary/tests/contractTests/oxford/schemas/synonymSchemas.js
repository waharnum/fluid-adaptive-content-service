"use strict";

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
                    "with": [{
                        "op": "add",
                        "path": "/properties/results/items/properties/lexicalEntries/items/properties/entries",
                        "value": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "senses": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "examples": {
                                                    "$ref": "/schemas/examples.json"
                                                },
                                                "synonyms": {
                                                    "$ref": "/schemas/synonyms.json"
                                                },
                                                "subsenses": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "synonyms": { "$ref": "/schemas/synonyms.json"}
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }]
                }
            }
        }
    },
    wrongWord: {
        "$ref": "/schemas/commonOxfordErrorSchema.json"
    },
    wrongLang: {
        "$ref": "/schemas/commonOxfordErrorSchema.json"
    }
};
