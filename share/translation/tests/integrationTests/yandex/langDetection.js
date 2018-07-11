"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockYandexLangDetection"); // providing mock data as an alternative to actual Yandex response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.langDetection");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

//TODO: figure how to test for large text

adaptiveContentService.tests.translation.yandex.langDetection = [{
    name: "POST request for the Language detection endpoint of Yandex Service",
    expect: 3,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/detect",
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/detect",
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/detect",
                method: "post"
            }
        }
    },
    sequence: [{
        func: "{noError}.send",
        args: { text: mockLangDetectionData.text.noError }
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockLangDetectionData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with empty text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockLangDetectionData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with absent text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.yandex.langDetection);
