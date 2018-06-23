"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");

require("kettle");

require("../handlerUtils");

/* Abstract grade for dictionary service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentServices.handlers.dictionary", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            func: "{that}.commonDictionaryDispatcher",
            args: ["{arguments}.0", "{that}.dictionaryHandlerImpl", "{that}"]
        },
        commonDictionaryDispatcher: "adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher",
        uriErrHandler: {
            funcName: "adaptiveContentServices.handlers.dictionary.uriErrHandler",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        sendSuccessResponse: {
          funcName: "adaptiveContentServices.handlerUtils.sendSuccessResponse",
          args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Dictionary"]
        },
        sendErrorResponse: {
          funcName: "adaptiveContentServices.handlerUtils.sendErrorResponse",
          args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Dictionary"]
        },
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "fluid.notImplemented"
    }
});

//Common dispatcher for all dictionary endpoints
adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher = function (request, serviceSpecificImp, that) {
    var version = request.req.params.version;
    var word = request.req.params.word;
    var lang = request.req.params.language;

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    serviceSpecificImp(request, version, word, lang, that);
};

/* Common function for all the dictionary endpoints
 * to check for long uri
 */
adaptiveContentServices.handlers.dictionary.uriErrHandler = function (request, version, word, serviceName, that) {
    if (word.length > 128) {
        var message = "Request URI too long: \"word\" can have maximum 128 characters";

        that.sendErrorResponse(request, version, serviceName, 414, message);
        return true;
    }
    else {
        return false;
    }
};

require("./handlers/wiktionaryHandlers");
require("./handlers/oxfordHandlers");
