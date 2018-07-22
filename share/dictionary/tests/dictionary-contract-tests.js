"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./contractTests/oxford/antonymsContractTest.js",
    "./contractTests/oxford/definitionContractTest.js",
    "./contractTests/oxford/extendedFrequencyContractTest.js",
    "./contractTests/oxford/frequencyContractTest.js",
    "./contractTests/oxford/listLanguagesContractTest.js",
    "./contractTests/oxford/pronunciationsContractTest.js",
    "./contractTests/oxford/synonymsContractTest.js",
    "./contractTests/wiktionary/definitionContractTest.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
