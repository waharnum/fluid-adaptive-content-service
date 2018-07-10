"use strict";

var fluid = require("infusion"),
    makeRequest = require("request");//npm package used to make requests to third-party services used

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");
require("../handlerUtils");

//Specific grade for Yandex
fluid.defaults("adaptiveContentService.handlers.translation.yandex", {
    gradeNames: "kettle.request.http",
    authenticationOptions: {
        "app_key": "@expand:kettle.resolvers.env(YANDEX_APP_KEY)"
    },
    urlBase: "https://translate.yandex.net/api/v1.5/tr.json/",
    invokers: {
        handleRequest: {
            func: "{that}.commonTranslationDispatcher",
            args: ["{arguments}.0", "{that}.translationHandlerImpl", "{that}"]
        },
        commonTranslationDispatcher: "adaptiveContentService.handlers.translation.yandex.commonTranslationDispatcher",
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Translation"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Translation"]
        },
        checkSourceText: "adaptiveContentService.handlers.translation.yandex.checkSourceText",
        checkServiceKey: "adaptiveContentService.handlers.translation.yandex.checkServiceKey",
        serviceKey: {
            funcName: "adaptiveContentService.handlers.translation.yandex.serviceKey",
            args: ["{that}"]
        },
        requiredData: "adaptiveContentService.handlers.translation.yandex.requiredData",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

// Common dispatcher for all Yandex endpoints
adaptiveContentService.handlers.translation.yandex.commonTranslationDispatcher = function (request, handlerFunc, that) {
    var version = request.req.params.version;

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    handlerFunc(request, version, that);
};

// check for errors in the text provided in the request body
adaptiveContentService.handlers.translation.yandex.checkSourceText = function (sourceText, characterLimit) {
    //no text found in request body
    if (!sourceText) {
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'text' field"
        };
    }
    //too long text
    else if (sourceText.length > characterLimit) {
        return {
            statusCode: 413,
            errorMessage: "Text in the request body should have character count less than or equal to " + characterLimit
        };
    }
    //No error regarding the request text
    else {
        return false;
    }
};

// check for errors with the service keys present in environment variables
adaptiveContentService.handlers.translation.yandex.checkServiceKey = function (serviceKey) {
    // No keys present in the environment variables
    if (!serviceKey) {
        var message = "Authentication failed - API key not found. Please check your environment variables";

        return {
            statusCode: 403,
            errorMessage: message
        };
    }
    // keys present in the environment variables
    else {
        return false;
    }
};

// return the service keys
adaptiveContentService.handlers.translation.yandex.serviceKey = function (that) {
    var serviceKey = that.options.authenticationOptions.app_key;

    return serviceKey;
};

//function to get the required translation data from yandex
adaptiveContentService.handlers.translation.yandex.requiredData = function (url, text) {
    var promise = fluid.promise();

    makeRequest.post(
        {
            url: url,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            if (error) {
                fluid.log("Error making request to the Yandex Service\n");
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error : Error with making request to the external service (Yandex) - " + error
                    }
                });
            }
            else {
                var responseBody = JSON.parse(body);

                promise.resolve({
                    statusCode: responseBody.code,
                    body: responseBody
                });
            }
        }
    );

    return promise;
};

//Yandex translation grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.translateText", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    characterLimit: 500,
    invokers: {
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.translateText.getTranslation",
        checkLanguageCodes: "adaptiveContentService.handlers.translation.yandex.translateText.checkLanguageCodes",
        checkTranslationError: "adaptiveContentService.handlers.translation.yandex.translateText.checkTranslationError",
        preRequestErrorCheck: {
            funcName: "adaptiveContentService.handlers.translation.yandex.translateText.preRequestErrorCheck",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.translation.yandex.translateText.constructResponse"
    }
});

//check for errors with the language codes
adaptiveContentService.handlers.translation.yandex.translateText.checkLanguageCodes = function (sourceLang, targetLang) {
    //source lang code has invalid length
    if (sourceLang.length > 3) {
        return {
            statusCode: 404,
            errorMessage: "Invalid 'sourceLang' parameter - Please check the language code"
        };
    }
    //target lang code has invalid length
    else if (targetLang.length > 3) {
        return {
            statusCode: 404,
            errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
        };
    }
    //valid lang code length
    else {
        return false;
    }
};

// check for errors in the input data, before making the request to external service
adaptiveContentService.handlers.translation.yandex.translateText.preRequestErrorCheck = function (characterLimit, serviceKey, sourceLang, targetLang, text, that) {
    //Error with the text in request body
    var sourceTextErrorContent = that.checkSourceText(text, characterLimit);

    if (sourceTextErrorContent) {
        return sourceTextErrorContent;
    }
    //No error with the text in request body
    else {
        //Error with the service keys in the environment variables
        var serviceKeyErrorContent = that.checkServiceKey(serviceKey);

        if (serviceKeyErrorContent) {
            return serviceKeyErrorContent;
        }
        //No error with the service keys
        else {
            //Error with the language codes provided
            var langCodeErrorContent = that.checkLanguageCodes(sourceLang, targetLang);

            if (langCodeErrorContent) {
                return langCodeErrorContent;
            }
            //No pre request error found
            else {
                return false;
            }
        }
    }
};

//function to catch the error content from the yandex service resopnse
adaptiveContentService.handlers.translation.yandex.translateText.checkTranslationError = function (serviceResponse) {

    //No error
    if (serviceResponse.statusCode === 200) {
        return false;
    }
    //invalid api key
    else if (serviceResponse.statusCode === 401) {
        return {
            statusCode: 403,
            errorMessage: "Authenticaion failed - " + serviceResponse.body.message
        };
    }
    //daily limit exceeded
    else if (serviceResponse.statusCode === 404) {
        return {
            statusCode: 429,
            errorMessage: serviceResponse.body.message
        };
    }
    //unsupported translation direction
    else if (serviceResponse.statusCode === 501) {
        return {
            statusCode: 404,
            errorMessage: serviceResponse.body.message + " - Please check the language codes"
        };
    }
    //remaining errors
    else {
        return {
            statusCode: serviceResponse.body.code,
            errorMessage: serviceResponse.body.message
        };
    }
};

// function to construct a response from the data provided by the Yandex service
adaptiveContentService.handlers.translation.yandex.translateText.constructResponse = function (serviceResponse, sourceLang, targetLang, sourceText) {
    return {
        sourceLang: sourceLang,
        targetLang: targetLang,
        sourceText: sourceText,
        translatedText: serviceResponse.body.text
    };
};

//Yandex translate text handler
adaptiveContentService.handlers.translation.yandex.translateText.getTranslation = function (request, version, that) {
    var sourceLang = request.req.params.sourceLang,
        targetLang = request.req.params.targetLang,
        text = request.req.body.text;

    try {
        var characterLimit = that.options.characterLimit,
            serviceKey = that.serviceKey();

        //check for errors before making request to the service
        var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, serviceKey, sourceLang, targetLang, text);

        if (preRequestErrorContent) {
            that.sendErrorResponse(request, version, "Yandex", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
        }
        //No pre request errors
        else {
            var url = that.options.urlBase + "translate?key=" + serviceKey + "&lang=" + sourceLang + "-" + targetLang;

            //making request to the service
            that.requiredData(url, text)
                .then(
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkTranslationError(serviceResponse);

                        //Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Yandex", errorContent.statusCode, errorContent.errorMessage);
                        }
                        //No error response
                        else {
                            var message = "Translation Successful",
                                response = that.constructResponse(serviceResponse, sourceLang, targetLang, text);

                            that.sendSuccessResponse(request, version, "Yandex", serviceResponse.statusCode, message, response);
                        }
                    }
                );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Yandex", 500, message);
    }
};

//Yandex language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    characterLimit: 500,
    invokers: {
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.langDetection.getLang",
        checkTranslationError: "adaptiveContentService.handlers.translation.yandex.langDetection.checkTranslationError",
        preRequestErrorCheck: {
            funcName: "adaptiveContentService.handlers.translation.yandex.langDetection.preRequestErrorCheck",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.translation.yandex.langDetection.constructResponse"
    }
});

// check for errors in the input data, before making the request to external service
adaptiveContentService.handlers.translation.yandex.langDetection.preRequestErrorCheck = function (characterLimit, serviceKey, text, that) {
    //Error with the text in request body
    var sourceTextErrorContent = that.checkSourceText(text, characterLimit);

    if (sourceTextErrorContent) {
        return sourceTextErrorContent;
    }
    //No error with the text in request body
    else {
        //Error with the service keys in the environment variables
        var serviceKeyErrorContent = that.checkServiceKey(serviceKey);

        if (serviceKeyErrorContent) {
            return serviceKeyErrorContent;
        }
        //No pre request error found
        else {
            return false;
        }
    }
};

//function to catch the error content from the yandex service resopnse
adaptiveContentService.handlers.translation.yandex.langDetection.checkTranslationError = function (serviceResponse) {

    //No error
    if (serviceResponse.statusCode === 200) {
        return false;
    }
    //invalid api key
    else if (serviceResponse.statusCode === 401) {
        return {
            statusCode: 403,
            errorMessage: "Authenticaion failed - " + serviceResponse.body.message
        };
    }
    //daily limit exceeded
    else if (serviceResponse.statusCode === 404) {
        return {
            statusCode: 429,
            errorMessage: serviceResponse.body.message
        };
    }
    //remaining errors
    else {
        return {
            statusCode: serviceResponse.body.code,
            errorMessage: serviceResponse.body.message
        };
    }
};

// function to construct a response from the data provided by the Yandex service
adaptiveContentService.handlers.translation.yandex.langDetection.constructResponse = function (serviceResponse, sourceText) {
    return {
        sourceText: sourceText,
        langCode: serviceResponse.body.lang
    };
};

//Yandex language detection handler
adaptiveContentService.handlers.translation.yandex.langDetection.getLang = function (request, version, that) {
    var text = request.req.body.text;

    try {
        var characterLimit = that.options.characterLimit,
            serviceKey = that.serviceKey();

        //check for errors before making request to the service
        var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, serviceKey, text);

        if (preRequestErrorContent) {
            that.sendErrorResponse(request, version, "Yandex", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
        }
        //No pre request errors
        else {
            var url = that.options.urlBase + "detect?&key=" + serviceKey;

            //making request to the service
            that.requiredData(url, text)
                .then(
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkTranslationError(serviceResponse);

                        //Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Yandex", errorContent.statusCode, errorContent.errorMessage);
                        }
                        //No error response
                        else {
                            var message = "Translation Successful",
                                response = that.constructResponse(serviceResponse, text);

                            that.sendSuccessResponse(request, version, "Yandex", serviceResponse.statusCode, message, response);
                        }
                    }
                );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Yandex", 500, message);
    }
};
