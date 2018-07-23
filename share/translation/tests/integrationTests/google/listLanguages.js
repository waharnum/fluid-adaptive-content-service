"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//mock data
var mockListLanguagesData = require("../../mockData/google/listLanguages");

/* testing grade for google listing supported languages - to override 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.google.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.google.listLanguages",
    invokers: {
        requiredData: "adaptiveContentService.test.handlers.translation.google.listLanguages.requiredData"
    }
});

// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.translation.google.listLanguages.requiredData = function () {
    var promise = fluid.promise();

    // no error response
    var langArray = mockListLanguagesData.noError;
    promise.resolve({
        statusCode: 200,
        body: langArray
    });

    return promise;
};

adaptiveContentService.tests.translation.google.listLanguages = [{
    name: "GET request for the List Languages endpoint of Google Service",
    expect: 1,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/languages",
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
        args: ["Translation Tests : Text Translation test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.google.listLanguages);
