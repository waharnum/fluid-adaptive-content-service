"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./unitTests/yandex/checkCommonYandexErrors.js",
    "./unitTests/yandex/checkLanguageCodes.js",
    "./unitTests/yandex/checkServiceKey.js",
    "./unitTests/yandex/checkSourceText.js",
    "./unitTests/yandex/isLangResponseEmpty.js",
    "./unitTests/yandex/langDetectionConstructResponse.js",
    "./unitTests/yandex/translationConstructResponse.js",
    "./integrationTests/yandex/detectAndTranslate.js",
    "./integrationTests/yandex/langDetection.js",
    "./integrationTests/yandex/textTranslation.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
