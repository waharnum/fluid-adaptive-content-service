"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
    require("dotenv").config();

var testIncludes = [
    "./contractTests/google/detectAndTranslate.js",
    "./contractTests/google/langDetection.js",
    "./contractTests/google/listLanguages.js",
    "./contractTests/yandex/langDetection.js",
    "./contractTests/yandex/listLanguages.js",
    "./contractTests/yandex/textTranslation.js"
];


// Check for keys
var translationContractTestKeys = [
    "YANDEX_API_KEY",
    "GOOGLE_API_KEY"
];

var hasAnyValidKeys = function (expectedKeys) {
    var anyValidKeys = false;

    fluid.each(expectedKeys, function (key) {
        var resolvedKey = kettle.resolvers.env(key);
        if(resolvedKey) {
            anyValidKeys = true;
        }
    });

    return anyValidKeys;
};

if(hasAnyValidKeys(translationContractTestKeys)) {
    kettle.loadTestingSupport();

    fluid.each(testIncludes, function (path) {
        require(path);
    });
} else {
    console.log("No service keys supplied, cannot run any contract tests");
};
