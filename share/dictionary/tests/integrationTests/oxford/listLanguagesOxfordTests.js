"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordListLanguages"); // providing mock data as an alternative to actual Oxford response

// mock data
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.oxford.listLanguages = [{
    name: "GET request for the list supported languages endpoint",
    expect: 1,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/languages",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{noError}.send"
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for 'no error' response successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.listLanguages);
