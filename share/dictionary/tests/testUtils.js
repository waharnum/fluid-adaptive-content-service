"use strict";

var fluid = require("infusion");
require("kettle");

var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.utils");

adaptiveContentService.tests.utils = {};

adaptiveContentService.tests.utils.assertStatusCode = function (message, expectedStatusCode, responseStatusCode) {
    jqunit.assertEquals(message, expectedStatusCode, responseStatusCode);
};
