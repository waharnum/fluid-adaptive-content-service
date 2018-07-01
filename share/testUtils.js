"use strict";

var fluid = require("infusion");
require("kettle");
var jqunit = require("node-jqunit");
var Ajv = require("ajv");//npm package for JSON scheme validation

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.utils");

adaptiveContentService.tests.utils = {};

adaptiveContentService.tests.utils.assertStatusCode = function (message, expectedStatusCode, responseStatusCode) {
    jqunit.assertEquals(message, expectedStatusCode, responseStatusCode);
};

adaptiveContentService.tests.utils.logAjvErrors = function (errors) {
    fluid.each(errors, function (error) {
        // property required but not found
        if (error.keyword === "required") {
            fluid.log("'" + error.params.missingProperty + "' is a REQUIRED property, but was absent");
        }
        // property of unexpected type
        else if (error.keyword === "type") {
            fluid.log("'data" + error.dataPath + "' SHOULD be of the type " + error.params.type.toUpperCase());
        }
    });
};

adaptiveContentService.tests.utils.contractTestHandler = function (data, schema, allSchemas, successMessage, failureMessage) {
    var ajv = new Ajv({ allErrors: true, schemas: allSchemas });
    require("ajv-merge-patch")(ajv);
    var validate = ajv.compile(schema);
    var valid = validate(data);

    //if the data from the service follows the expected schema
    if (valid) {
        jqunit.assert("\n\n" + successMessage + "\n");
    }
    //if the data from the service does not follow the expected schema
    else {
        var errors = validate.errors;
        adaptiveContentService.tests.utils.logAjvErrors(errors);
        jqunit.fail("\n\n" + failureMessage + "\n");
    }
};

adaptiveContentService.tests.utils.getOxfordRequestHeaders = function () {
    return {
        "app_id": process.env.OXFORD_APP_ID,
        "app_key": process.env.OXFORD_APP_KEY
    };
};
