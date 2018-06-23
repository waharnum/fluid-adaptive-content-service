"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");

require("kettle");

var wd = require("word-definition");

//Specific grade for Wiktionary
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented"
    }
});

//function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

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
                statusCode: 500,
                errorMessage: "The error hasn\"t been handled yet"
            };
        }
    }

    //Return false if no error found
    else {
        return;
    }
};

//Wiktionary definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData"
    }
});

//Wiktionary definition handler
adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
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
                        var jsonResponse = {
                            word: serviceResponse.word,
                            entries: [
                                {
                                    category: serviceResponse.category,
                                    definitions: [serviceResponse.definition]
                                }
                            ]
                        };

                        that.sendSuccessResponse(request, version, "Wiktionary", 200, "Word Found", jsonResponse);
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
adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });
    return promise;
};

//Wiktionary synonyms grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.synonyms", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.requiredData"
    }
});

//Wiktionary synonyms handler
adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.getSynonyms = function (request, version, that) {
    var message = "This Service doesn't provide synonyms";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.requiredData = function () {
  /*
   * Service doesn't provide synonyms
   * So no data required
   */
};

//Wiktionary antonyms grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.antonyms", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.getAntonyms",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.requiredData"
    }
});

//Wiktionary antonyms handler
adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.getAntonyms = function (request, version, that) {
    var message = "This Service doesn't provide antonyms";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.requiredData = function () {
  /*
   * Service doesn't provide antonyms
   * So no data required
   */
};

//Wiktionary pronunciations grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.getPronunciations",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.requiredData"
    }
});

//Wiktionary pronunciations handler
adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.getPronunciations = function (request, version, that) {
    var message = "This Service doesn't provide pronunciations";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.requiredData = function () {
  /*
   * Service doesn't provide pronunciations
   * So no data required
   */
};


//Wiktionary frequency grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.frequency", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.frequency.getFrequency",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.frequency.requiredData"
    }
});

//Wiktionary frequency handler
adaptiveContentServices.handlers.dictionary.wiktionary.frequency.getFrequency = function (request, version, that) {
    var message = "This Service doesn't provide frequency";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.frequency.requiredData = function () {
  /*
   * Service doesn't provide frequency
   * So no data required
   */
};
