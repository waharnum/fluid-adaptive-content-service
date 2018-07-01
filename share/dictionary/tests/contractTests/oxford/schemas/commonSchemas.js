"use strict";

module.exports = {
    definitions: {
        "$id": "/schemas/definition.json",
        "type": "array",
        "items": { "type": "string" }
    },
    examples: {
        "$id": "/schemas/examples.json",
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "text": { "type": "string" }
            }
        }
    },
    synonyms: {
        "$id": "/schemas/synonyms.json",
        "type": "array",
        "items": {
            "type": "object",
            "required": ["text"],
            "properties": {
                "text": { "type": "string" }
            }
        }
    },
    antonyms: {
        "$id": "/schemas/antonyms.json",
        "type": "array",
        "items": {
            "type": "object",
            "required": ["text"],
            "properties": {
                "text": { "type": "string" }
            }
        }
    },
    oxfordResponseProperty: {
        "$id": "/schemas/oxfordResponseProperty.json",
        "type": "object",
        "required": ["statusCode"],
        "properties": {
            "statusCode": { "type": "number" }
        }
    },
    commonOxford: {
        "$id": "/schemas/commonOxford.json",
        "type": "object",
        "required": ["results"],
        "properties": {
            "results": {
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["id", "lexicalEntries"],
                    "properties": {
                        "lexicalEntries": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": ["lexicalCategory", "entries"],
                                "properties": {
                                    "lexicalCategory": { "type": "string" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    commonOxfordErrorSchema: {
        "$id": "/schemas/commonOxfordErrorSchema.json",
        "type": "object",
        "required": ["response", "body"],
        "properties": {
            "response": {
                "$ref": "/schemas/oxfordResponseProperty.json"
            },
            "body": {"type": "string"},
            "jsonBody": {"type": "string"}
        }
    }
};
