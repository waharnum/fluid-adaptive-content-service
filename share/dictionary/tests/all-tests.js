"use strict";

var fluid = require("infusion");
var kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./general/antonymsTests.js",
    "./general/definitionTests.js",
    "./general/synonymsTests.js",
    "./general/pronunciationsTests.js",
    "./general/frequencyTests.js",
    "./oxford/antonymsOxfordTests.js",
    "./oxford/definitionOxfordTests.js",
    "./oxford/synonymsOxfordTests.js",
    "./oxford/pronunciationsOxfordTests.js",
    "./oxford/frequencyOxfordTests.js",
    "./wiktionary/antonymsWiktionaryTests.js",
    "./wiktionary/definitionWiktionaryTests.js",
    "./wiktionary/synonymsWiktionaryTests.js",
    "./wiktionary/pronunciationsWiktionaryTests.js",
    "./wiktionary/frequencyWiktionaryTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
