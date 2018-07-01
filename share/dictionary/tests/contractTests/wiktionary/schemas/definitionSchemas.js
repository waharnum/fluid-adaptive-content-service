"use strict";

module.exports = {
    correctWord: {
        "type": "object",
        "required": ["word", "category", "definition"],
        "properties": {
            "word": {"type": "string"},
            "category": {"type": "string"},
            "definition": {"type": "string"}
        }
    },
    wrongWord: {
        "type": "object",
        "required": ["err"],
        "properties": {
            "err": {"type": "string"}
        }
    },
    wrongLang: {
        "type": "object",
        "required": ["err"],
        "properties": {
            "err": {"type": "string"}
        }
    }
};
