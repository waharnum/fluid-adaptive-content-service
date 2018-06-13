"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
var jqunit = require("node-jqunit");

require("dotenv").config();

require("../../../../index.js");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.general.antonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

// Update all the other name spaces into this style so they don't collide
// with each other when multiple test files are loaded at once
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
                path: "/v1/dictionary/en/antonyms/play",
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/en/antonyms/wrongword",
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wrong/antonyms/word",
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/en/antonyms/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{correctWordTest}.send"
    },
    {
        event: "{correctWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.general.antonyms.correctWordHandler"
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.general.antonyms.wrongWordHandler"
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.general.antonyms.wrongLangHandler"
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.general.antonyms.longUriHandler"
    }
    ]
}];

//Test for the correct word
adaptiveContentService.tests.dictionary.general.antonyms.correctWordHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for correct word successful", 200, that.nativeResponse.statusCode);
};

//Test for the wrong word
adaptiveContentService.tests.dictionary.general.antonyms.wrongWordHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for wrong word successful", 404, that.nativeResponse.statusCode);
};

//Test for the unsupported language
adaptiveContentService.tests.dictionary.general.antonyms.wrongLangHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for unsupported language successful", 404, that.nativeResponse.statusCode);
};

//Test for long uri
adaptiveContentService.tests.dictionary.general.antonyms.longUriHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Antonyms test for long uri", 414, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.general.antonyms);
