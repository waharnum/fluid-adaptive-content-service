"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockYandexTranslation"); // providing mock data as an alternative to actual Yandex response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.translateText");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//TODO: figure how to test for large text
//TODO: figure out a way to have common data here and in nock configs so that there are no conflicts

var sourceLang = {
    correct: "en",
    wrong: "eng", //valid lang code, but not found
    invalid: "english" //greater than 3 letters (invalid)
};

var targetLang = {
    correct: "de",
    wrong: "ger",
    invalid: "german"
};

var testText = {
    noError: "This is the text to be translated",
    empty: "",
    absent: undefined
};

adaptiveContentService.tests.translation.yandex.translateText = [{
    name: "POST request for the Text Translation endpoint of Yandex Service",
    expect: 6,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/" + sourceLang.correct + "-" + targetLang.correct,
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/" + sourceLang.correct + "-" + targetLang.correct,
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/" + sourceLang.correct + "-" + targetLang.correct,
                method: "post"
            }
        },
        unsupportedTranslationDirection: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex" + sourceLang.wrong + "-" + targetLang.correct,
                method: "post"
            }
        },
        invalidSourceLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex" + sourceLang.invalid + "-" + targetLang.correct,
                method: "post"
            }
        },
        invalidTargetLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex" + sourceLang.correct + "-" + targetLang.invalid,
                method: "post"
            }
        }
    },
    sequence: [{
        func: "{noError}.send",
        args: { text: testText.noError }
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: ""}
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: testText.empty}
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{unsupportedTranslationDirection}.send",
        args: { text: testText.absent}
    },
    {
        event: "{unsupportedTranslationDirection}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidSourceLangCode}.send",
        args: { text: testText.noError}
    },
    {
        event: "{invalidSourceLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidTargetLangCode}.send",
        args: { text: testText.noError}
    },
    {
        event: "{invalidTargetLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors", 404, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.yandex.translateText);
