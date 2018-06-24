"use strict";

var fluid = require("infusion");
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

var wd = require("word-definition");

//Specific grade for Wiktionary
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentService.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented"
    }
});

//function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

  //Check if there is an error
    if (serviceResponse.err) {

        //Word not found
        if (serviceResponse.err === "not found") {
            return {
                statusCode: 404,
                errorMessage: "Word not found"
            };
        }

        //Language unsupported by the third-party service
        else if (serviceResponse.err === "unsupported language") {
            return {
                statusCode: 404,
                errorMessage: "Unsupported Language: Only English (en), French (fr) and German (de) are supported right now"
            };
        }

        //Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 501,
                errorMessage: "The error hasn't been handled yet"
            };
        }
    }

    //Return false if no error found
    else {
        return;
    }
};

//Wiktionary definition grade
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentService.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.wiktionary.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentService.handlers.dictionary.wiktionary.definition.requiredData",
        constructResponse: "adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse"
    }
});

//Wiktionary definition handler
adaptiveContentService.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Wiktionary")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Wiktionary", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";
                        var response = that.constructResponse(serviceResponse);

                        that.sendSuccessResponse(request, version, "Wiktionary", 200, "Word Found", response);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Wiktionary", 500, message);
    }
};

//function to get definition from the wiktionary service
adaptiveContentService.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });
    return promise;
};

//function to construct a useful response from the data provided by the word-definition (Wiktionary) service
adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.word,
        entries: [
            {
                category: jsonServiceResponse.category,
                definitions: [jsonServiceResponse.definition]
            }
        ]
    };

    return response;
};

//Wiktionary "Service not provided" grade
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        getEndpointName: "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.getEndpointName",
        requiredDataImpl: "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.requiredData"
    }
});

//Wiktionary service not provided handler function
adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl = function (request, version, that) {
    var endpointName = that.getEndpointName(request.req.originalUrl);

    var message = "This Service doesn't provide " + endpointName;

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

//function to get the endpoint name from the request url
adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.getEndpointName = function (url) {
    var endpointNameRegex = /\/\w+\/\w+\/\w+\/\w+\/(\w+)\/.+/g; //to extract name of the endpoint from the url
    var match = endpointNameRegex.exec(url);

    return match[1];
};

adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.requiredData = function () {
    /*
     * Service doesn't provide synonyms
     * So no data required
     */
};
