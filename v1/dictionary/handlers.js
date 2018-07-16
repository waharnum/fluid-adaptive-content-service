"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

require("../handlerUtils");

/* Abstract grade for dictionary service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.dictionary", {
    gradeNames: "kettle.request.http",
    wordCharacterLimit: 128,
    invokers: {
        handleRequest: {
            func: "{that}.commonDictionaryDispatcher",
            args: ["{arguments}.0", "{that}.dictionaryHandlerImpl", "{that}"]
        },
        commonDictionaryDispatcher: "adaptiveContentService.handlers.dictionary.commonDictionaryDispatcher",
        checkWordLength: "adaptiveContentService.handlers.dictionary.checkWordLength",
        checkUriError: "adaptiveContentService.handlers.dictionary.checkUriError",
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Dictionary"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Dictionary"]
        },
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "fluid.notImplemented"
    }
});

//Common dispatcher for all dictionary endpoints
adaptiveContentService.handlers.dictionary.commonDictionaryDispatcher = function (request, serviceSpecificImp, that) {
    var version = request.req.params.version,
        word = request.req.params.word,
        lang = request.req.params.language;

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    serviceSpecificImp(request, version, word, lang, that);
};

//detele TEST:Checks if the word exceeds character limit (returns false if it does and true if it doesn't)
adaptiveContentService.handlers.dictionary.checkWordLength = function (word, characterLimit) {
    if (word.length > characterLimit) {
        return false;
    }
    else {
        return true;
    }
};

/* TEST:Common function for all the dictionary endpoints
 * to check for long uri
 */
adaptiveContentService.handlers.dictionary.checkUriError = function (word, that) {
    var characterLimit = that.options.wordCharacterLimit;
    if (word.length > characterLimit) {
        return {
            statusCode: 414,
            errorMessage: "Request URI too long : 'word' can have maximum " + characterLimit + " characters"
        };
    }
    else {
        return false;
    }
};

require("./handlers/wiktionaryHandlers");
require("./handlers/oxfordHandlers");
