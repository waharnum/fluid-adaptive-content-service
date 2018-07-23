"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordAntonyms"); // providing mock data as an alternative to actual Oxford response

// mock data
var mockAntonymsData = require("../../mockData/oxford/antonyms");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.general.antonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.general.antonyms = [{
    name: "GET request for the Antonyms dictionary endpoint",
    expect: 4,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.correct,
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.wrong,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary" + mockAntonymsData.lang.wrong + "/antonyms/" + mockAntonymsData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockAntonymsData.lang.correct + "/antonyms/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
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
        args: ["Dictionary Tests : Antonyms test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test for wrong word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.general.antonyms);
