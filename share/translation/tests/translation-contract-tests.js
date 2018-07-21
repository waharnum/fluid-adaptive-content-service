"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./contractTests/google/detectAndTranslate.js",
    "./contractTests/google/langDetection.js",
    "./contractTests/google/listLanguages.js",
    "./contractTests/yandex/langDetection.js",
    "./contractTests/yandex/listLanguages.js",
    "./contractTests/yandex/textTranslation.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
