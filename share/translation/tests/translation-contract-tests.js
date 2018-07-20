"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./contractTests/google/detectAndTranslate.js",
    "./contractTests/google/langDetection.js",
    "./contractTests/yandex/textTranslation.js",
    "./contractTests/yandex/langDetection.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
