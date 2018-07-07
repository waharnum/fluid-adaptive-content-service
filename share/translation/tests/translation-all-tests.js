"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./unitTests/yandex/checkSourceText.js",
    "./unitTests/yandex/checkServiceKey.js",
    "./unitTests/yandex/checkLanguageCodes.js",
    "./unitTests/yandex/checkTranslationError.js",
    "./unitTests/yandex/translationConstructResponse.js",
    "./integrationTests/yandex/textTranslation.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
