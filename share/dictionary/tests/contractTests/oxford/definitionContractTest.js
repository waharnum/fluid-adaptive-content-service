"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqunit = require("node-jqunit");
require("dotenv").config();//npm package to get variables from '.env' file

var makeRequest = require("request");//npm package used to make requests to third-party services used

require("../../../../testUtils");

kettle.loadTestingSupport();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.definition");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.definition", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.definition.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.definition.getData = function (word, lang, apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word,
            headers: apiKeys
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Oxford - Definitions) : Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For definitions failed due to error making request to the external service (Oxford Service)");
            }
            else {
                var jsonBody;

                //check for the presence of response body
                if (body) {
                    try {
                        jsonBody = JSON.parse(body);
                    }
                    catch (err) {
                        jsonBody = body;
                    }

                    var data = {
                        response: response,
                        body: body,
                        jsonBody: jsonBody
                    };

                    that.events.onDataReceive.fire(data);
                }
                else {
                    ACS.log("Contract Test (Oxford - Definitions) : Response from the external service SHOULD have 'body' property");
                    jqunit.fail("Contract Test : For definitions failed (Oxford Service)");
                }
            }
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.definition.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.definition"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.definition.tester"
        }
    }
});

var mockDefinitionData = require("../../mockData/oxford/definitions");

var definitionSchemas = require("./schemas/definitionSchemas"), //main schemas which will be compiled
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas

//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.definitions, commonSchemas.oxfordResponseProperty, commonSchemas.commonOxford],
    wrongWord: [commonSchemas.oxfordResponseProperty, commonSchemas.commonOxfordErrorSchema],
    wrongLang: [commonSchemas.oxfordResponseProperty, commonSchemas.commonOxfordErrorSchema]
};

var successMessage = {
    correctWord: "Contract Test : For definitions with correct word and language successful (Oxford Service)",
    wrongWord: "Contract Test : For definitions with wrong word successful (Oxford Service)",
    wrongLang: "Contract Test : For definitions with wrong language successful (Oxford Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For definitions with correct word and language failed (Oxford Service)",
    wrongWord: "Contract Test : For definitions with wrong word failed (Oxford Service)",
    wrongLang: "Contract Test : For definitions with wrong language failed (Oxford Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.definition.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For definitions (Oxford Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For definitions (Oxford Service)",
                sequence: [
                    //for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockDefinitionData.word.correct, mockDefinitionData.lang.correct, mockDefinitionData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    //for wrong word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockDefinitionData.word.wrong, mockDefinitionData.lang.correct, mockDefinitionData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.wrongWord, allNeededSchemas.wrongWord, successMessage.wrongWord, failureMessage.wrongWord]
                    },
                    //for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockDefinitionData.word.correct, mockDefinitionData.lang.wrong, mockDefinitionData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    }
                ]
            }
        ]
    }]
});

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.definition.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockDefinitionData.apiKeys.correct, testTree, "Definition (Oxford) Contract test");
