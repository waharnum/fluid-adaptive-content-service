"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./unitTests/yandex/checkSourceText.js",
    "./unitTests/yandex/checkServiceKey.js",
    "./unitTests/yandex/checkLanguageCodes.js",
    "./unitTests/yandex/checkCommonYandexErrors.js",
    "./unitTests/yandex/translationConstructResponse.js",
    "./unitTests/yandex/isLangResponseEmpty.js",
    "./integrationTests/yandex/textTranslation.js",
    "./integrationTests/yandex/langDetection.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
