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
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.getData = function (word, lang, requestHeaders, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word + "/synonyms",
            headers: requestHeaders
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Oxford - Synonyms) : Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For synonyms failed due to error making request to the external service (Oxford Service)");
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
                    ACS.log("Contract Test (Oxford - Synonyms) : Response from the external service SHOULD have 'body' property");
                    jqunit.fail("Contract Test : For synonyms failed (Oxford Service)");
                }
            }
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.tester"
        }
    }
});

var correctWord = "word",
    correctLang = "en",
    wrongWord = "wrongWord",
    wrongLang = "wrongLang";

var synonymSchemas = require("./schemas/synonymSchemas"), //main schemas which will be compiled
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas


//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.synonyms, commonSchemas.examples, commonSchemas.oxfordResponseProperty, commonSchemas.commonOxford],
    wrongWord: [commonSchemas.oxfordResponseProperty, commonSchemas.commonOxfordErrorSchema],
    wrongLang: [commonSchemas.oxfordResponseProperty, commonSchemas.commonOxfordErrorSchema]
};

var successMessage = {
    correctWord: "Contract Test : For synonyms with correct word and language successful (Oxford Service)",
    wrongWord: "Contract Test : For synonyms with wrong word successful (Oxford Service)",
    wrongLang: "Contract Test : For synonyms with wrong language successful (Oxford Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For synonyms with correct word and language failed (Oxford Service)",
    wrongWord: "Contract Test : For synonyms with wrong word failed (Oxford Service)",
    wrongLang: "Contract Test : For synonyms with wrong language failed (Oxford Service)"
};

var requestHeaders = adaptiveContentService.tests.utils.getOxfordRequestHeaders();

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For synonyms (Oxford Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For synonyms (Oxford Service)",
                sequence: [
                    //for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [correctWord, correctLang, requestHeaders]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", synonymSchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    //for wrong word
                    {
                        func: "{testComponent}.requestForData",
                        args: [wrongWord, correctLang, requestHeaders]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", synonymSchemas.wrongWord, allNeededSchemas.wrongWord, successMessage.wrongWord, failureMessage.wrongWord]
                    },
                    //for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [correctWord, wrongLang, requestHeaders]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", synonymSchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    }
                ]
            }
        ]
    }]
});

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.synonyms.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(requestHeaders, testTree, "Synonyms (Oxford) Contract test");
