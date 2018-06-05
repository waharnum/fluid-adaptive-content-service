"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary");

fluid.logObjectRenderChars = 10000; // to ask

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary = [{
    name: "GET request for the Antonyms dictionary endpoint of the Wiktionary Service",
    expect: 1,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "./v1/dictionary/config/"
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
        listener: "adaptiveContentService.tests.dictionary.serviceNotProvidedTest"
    }
    ]
}];

//Wiktionary service doesn't provide antonyms
adaptiveContentService.tests.dictionary.serviceNotProvidedTest = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for Wiktionary Service successful", 400, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary);
