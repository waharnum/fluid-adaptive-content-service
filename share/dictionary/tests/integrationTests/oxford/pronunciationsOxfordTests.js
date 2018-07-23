"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordPronunciations"); // providing mock data as an alternative to actual Oxford response

// mock data
var mockPronunciationsData = require("../../mockData/oxford/pronunciations");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.pronunciations");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.oxford.pronunciations = [{
    name: "GET request for the Pronunciations dictionary endpoint of Oxford Service",
    expect: 4,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockPronunciationsData.lang.correct + "/pronunciations/" + mockPronunciationsData.word.correct,
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockPronunciationsData.lang.correct + "/pronunciations/" + mockPronunciationsData.word.wrong,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockPronunciationsData.lang.wrong + "/pronunciations/" + mockPronunciationsData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockPronunciationsData.lang.correct + "/pronunciations/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{correctWordTest}.send"
    },
    {
        event: "{correctWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Pronunciations test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Pronunciations test for correct word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Pronunciations test for correct word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Pronunciations test for correct word successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.pronunciations);
