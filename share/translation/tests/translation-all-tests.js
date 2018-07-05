"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./unitTests/yandex/checkSourceText.js",
    "./unitTests/yandex/checkServiceKey.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
