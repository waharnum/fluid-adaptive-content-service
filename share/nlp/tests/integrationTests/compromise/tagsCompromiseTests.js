"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.sentenceTagging");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

var testRequestBody = {
    correctSentence: {
        sentence: "Hello world"
    },
    emptySentence: {}
};

//TODO: figure how to test for long sentences

adaptiveContentService.tests.nlp.compromise.sentenceTagging = [{
    name: "GET request for the Sentence Tagging NLP endpoint",
    expect: 2,
    config: {
        configName: "nlpServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/nlp/config/"
    },
    components: {
        correctSentence: {
            type: "kettle.test.request.http",
            options: {
                path: "/:version/nlp/compromise/tags/",
                method: "post"
            }
        },
        emptySentence: {
            type: "kettle.test.request.http",
            options: {
                path: "/:version/nlp/compromise/tags/",
                method: "post"
            }
        }
    },
    sequence: [
        {
            func: "{correctSentence}.send",
            args: testRequestBody.correctSentence
        },
        {
            event: "{correctSentence}.events.onComplete",
            listener: "adaptiveContentService.tests.utils.assertStatusCode",
            args: ["NLP Tests : Sentence Tagging test for correct sentence successful", 200, "{arguments}.1.nativeResponse.statusCode"]
        },
        {
            func: "{emptySentence}.send",
            args: testRequestBody.emptySentence
        },
        {
            event: "{emptySentence}.events.onComplete",
            listener: "adaptiveContentService.tests.utils.assertStatusCode",
            args: ["NLP Tests : Sentence Tagging test for empty sentence successful", 400, "{arguments}.1.nativeResponse.statusCode"]
        }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.nlp.compromise.sentenceTagging);
