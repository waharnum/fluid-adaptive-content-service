"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./contractTests/yandex/textTranslation.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
