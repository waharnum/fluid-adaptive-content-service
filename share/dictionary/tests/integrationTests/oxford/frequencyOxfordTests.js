"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordFrequency"); // providing mock data as an alternative to actual Oxford response

var correctWord = "play",
    correctLang = "en",
    wrongLang = "wrong";

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.frequency");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.oxford.frequency = [{
    name: "GET request for the Frequency dictionary endpoint of Oxford Service",
    expect: 3,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + correctLang + "/frequency/" + correctWord,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + wrongLang + "/frequency/" + correctWord,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + correctLang + "/frequency/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
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
        args: ["Dictionary Tests : Frequency test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency test for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency test for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

/*
 * No wrong word test here
 * because the frequency is returned
 * 0 for them
 */

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.frequency);
