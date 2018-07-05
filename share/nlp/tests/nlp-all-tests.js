"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./integrationTests/compromise/tagsCompromiseTests.js",
    "./unitTests/compromise/checkNlpError.js",
    "./unitTests/compromise/constructResponse.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
