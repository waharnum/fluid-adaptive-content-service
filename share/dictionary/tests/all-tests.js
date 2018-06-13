var fluid = require("infusion");
var kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./general/antonymsTests.js",
    // "./general/definitionTests.js",
    // "./general/synonymsTests.js",
    // "./oxford/antonymsOxfordTests.js",
    // "./oxford/definitionOxfordTests.js",
    // "./oxford/synonymsOxfordTests.js",
    "./wiktionary/antonymsWiktionaryTests.js",
    // "./wiktionary/definitionWiktionaryTests.js",
    // "./wiktionary/synonymsWiktionaryTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
