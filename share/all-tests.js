"use strict";

var fluid = require("infusion");
var kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./dictionary/tests/integrationTests/general/antonymsTests.js",
    "./dictionary/tests/integrationTests/general/definitionTests.js",
    "./dictionary/tests/integrationTests/general/synonymsTests.js",
    "./dictionary/tests/integrationTests/general/pronunciationsTests.js",
    "./dictionary/tests/integrationTests/general/frequencyTests.js",
    "./dictionary/tests/integrationTests/general/extendedFrequencyTests.js",
    "./dictionary/tests/integrationTests/oxford/antonymsOxfordTests.js",
    "./dictionary/tests/integrationTests/oxford/definitionOxfordTests.js",
    "./dictionary/tests/integrationTests/oxford/synonymsOxfordTests.js",
    "./dictionary/tests/integrationTests/oxford/pronunciationsOxfordTests.js",
    "./dictionary/tests/integrationTests/oxford/frequencyOxfordTests.js",
    "./dictionary/tests/integrationTests/oxford/extendedFrequencyOxfordTests.js",
    "./dictionary/tests/integrationTests/wiktionary/antonymsWiktionaryTests.js",
    "./dictionary/tests/integrationTests/wiktionary/definitionWiktionaryTests.js",
    "./dictionary/tests/integrationTests/wiktionary/synonymsWiktionaryTests.js",
    "./dictionary/tests/integrationTests/wiktionary/pronunciationsWiktionaryTests.js",
    "./dictionary/tests/integrationTests/wiktionary/frequencyWiktionaryTests.js",
    "./dictionary/tests/integrationTests/wiktionary/extendedFrequencyWiktionaryTests.js",
    "./nlp/tests/integrationTests/compromise/tagsCompromiseTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
