"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./unitTests/common/checkLanguageCodes.js",
    "./unitTests/common/checkServiceKey.js",
    "./unitTests/common/checkSourceText.js",
    "./unitTests/google/checkCommonGoogleErrors.js",
    "./unitTests/google/isLangUndefined.js",
    "./unitTests/google/langDetectionConstructResponse.js",
    "./unitTests/google/listLanguagesConstructResponse.js",
    "./unitTests/google/translationConstructResponse.js",
    "./unitTests/yandex/checkCommonYandexErrors.js",
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
