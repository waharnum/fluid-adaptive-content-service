"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./integrationTests/general/antonymsTests.js",
    "./integrationTests/general/definitionTests.js",
    "./integrationTests/general/synonymsTests.js",
    "./integrationTests/general/pronunciationsTests.js",
    "./integrationTests/general/frequencyTests.js",
    "./integrationTests/general/extendedFrequencyTests.js",
    "./integrationTests/oxford/antonymsOxfordTests.js",
    "./integrationTests/oxford/definitionOxfordTests.js",
    "./integrationTests/oxford/synonymsOxfordTests.js",
    "./integrationTests/oxford/pronunciationsOxfordTests.js",
    "./integrationTests/oxford/frequencyOxfordTests.js",
    "./integrationTests/oxford/extendedFrequencyOxfordTests.js",
    "./integrationTests/wiktionary/antonymsWiktionaryTests.js",
    "./integrationTests/wiktionary/definitionWiktionaryTests.js",
    "./integrationTests/wiktionary/synonymsWiktionaryTests.js",
    "./integrationTests/wiktionary/pronunciationsWiktionaryTests.js",
    "./integrationTests/wiktionary/frequencyWiktionaryTests.js",
    "./integrationTests/wiktionary/extendedFrequencyWiktionaryTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
