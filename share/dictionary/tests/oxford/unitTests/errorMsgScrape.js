"use strict";

var fluid = require("infusion");
// var kettle = require("kettle");
var jqunit = require("node-jqunit");
// require("dotenv").config();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");

var errResponse = {
    html: "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>",
    nonHtml: "Error message not in HTML format"
};

adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape.html = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape(errResponse.html);

    var expectedReturnVal = "Not Found: No entry available for 'wrongword' in 'en'";

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with html error response", expectedReturnVal, returnVal);
};

adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape.nonHtml = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape(errResponse.nonHtml);

    jqunit.assertEquals("Unit Test : For checkDictionary function : Successful with nonHtml error response", errResponse.nonHtml, returnVal);
};

jqunit.test(
    "Unit Test : For errorMsgScrape function (Oxford Service)",
    function () {
        adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape.html();
        adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape.nonHtml();
    }
);
