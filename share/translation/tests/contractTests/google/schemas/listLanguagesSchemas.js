"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "array",
        "items": { "type": "string" }
    },
    authError: commonSchemas.authError,
};
