"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
var jqunit = require("node-jqunit");

require("dotenv").config();

require("../../../../index.js");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.antonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

// NOTE: Update all the other name spaces into this style so they don't collide
// with each other when multiple test files are loaded at once
adaptiveContentService.tests.dictionary.wiktionary.antonyms = [{
    name: "GET request for the Antonyms dictionary endpoint of the Wiktionary Service",
    expect: 1,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        serviceNotProvidedTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/en/antonyms/word",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{serviceNotProvidedTest}.send"
    },
    {
        event: "{serviceNotProvidedTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.wiktionary.antonyms.serviceNotProvidedTest"
    }
    ]
}];

//Wiktionary service doesn't provide antonyms
adaptiveContentService.tests.dictionary.wiktionary.antonyms.serviceNotProvidedTest = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for Wiktionary Service successful", 400, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.wiktionary.antonyms);
