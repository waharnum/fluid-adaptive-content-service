"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");

require("dotenv").config();//npm package to get variables from '.env' file

var googleApiKey = kettle.resolvers.env("GOOGLE_API_KEY");

var googleTranslate = require("google-translate")(googleApiKey); // package for convenient usage of google translation service

// Specific grade for Google
fluid.defaults("adaptiveContentService.handlers.translation.google", {
    gradeNames: "adaptiveContentService.handlers.translation",
    authenticationOptions: {
        "api_key": "@expand:kettle.resolvers.env(GOOGLE_API_KEY)"
    },
    invokers: {
        checkCommonGoogleErrors: "adaptiveContentService.handlers.translation.google.checkCommonGoogleErrors",
        constructResponse: "fluid.notImplemented",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

// function to catch the error content from the google service resopnse
adaptiveContentService.handlers.translation.google.checkCommonGoogleErrors = function (serviceResponse) {

    // No error
    if (serviceResponse.statusCode === 200) {
        return false;
    }
    // invalid api key
    else if (serviceResponse.statusCode === 400 && serviceResponse.body.error.message === "API key not valid. Please pass a valid API key.") {
        return {
            statusCode: 403,
            errorMessage: "Authentication failed - " + serviceResponse.body.error.message
        };
    }
    // invalid target language
    else if (serviceResponse.statusCode === 400 && serviceResponse.body.error.message === "Invalid Value") {
        return {
            statusCode: 404,
            errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
        };
    }
    // error making request
    else if (serviceResponse.statusCode === 500) {
        return {
            statusCode: 500,
            errorMessage: serviceResponse.body.message
        };
    }
    // remaining errors
    else {
        return {
            statusCode: serviceResponse.body.error.code,
            errorMessage: serviceResponse.body.error.message
        };
    }
};

// Google detect and translate grade
fluid.defaults("adaptiveContentService.handlers.translation.google.detectAndTranslate", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.detectAndTranslate.requiredData",
        constructResponse: "adaptiveContentService.handlers.translation.google.detectAndTranslate.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.detectAndTranslate.getTranslation"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.detectAndTranslate.requiredData = function (targetLang, text) {
    var promise = fluid.promise();

    googleTranslate.translate(text, targetLang, function (err, translation) {
        if (err) {

            // error making request
            if (err.body === undefined) {
                ACS.log("Error making request to the Google Service (Detect-Translate endpoint)");
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error : Error with making request to the external service (Google)"
                    }
                });
            }
            else {
                var errorBody = JSON.parse(err.body);

                promise.resolve({
                    statusCode: errorBody.error.code,
                    body: errorBody
                });
            }
        }
        else {
            promise.resolve({
                statusCode: 200,
                body: translation
            });
        }
    });

    return promise;
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.detectAndTranslate.constructResponse = function (serviceResponse, targetLang) {
    return {
        sourceLang: serviceResponse.body.detectedSourceLanguage,
        targetLang: targetLang,
        sourceText: serviceResponse.body.originalText,
        translatedText: serviceResponse.body.translatedText
    };
};

// Google translate text handler
adaptiveContentService.handlers.translation.google.detectAndTranslate.getTranslation = function (request, version, that) {
    var targetLang = request.req.params.targetLang,
        text = request.req.body.text;

    try {
        var characterLimit = that.options.characterLimit;

        var langsObj = {
            target: {
                name: "targetLang",
                value: targetLang
            }
        };

        // check for errors before making request to the service
        var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, googleApiKey, langsObj, text, that);

        if (preRequestErrorContent) {
            that.sendErrorResponse(request, version, "Google", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
        }
        else {
            that.requiredData(targetLang, text)
                .then(
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkCommonGoogleErrors(serviceResponse);

                        // Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Google", errorContent.statusCode, errorContent.errorMessage);
                        }
                        // No error response
                        else {
                            var message = "Translation Successful",
                                response = that.constructResponse(serviceResponse, targetLang);

                            that.sendSuccessResponse(request, version, "Google", serviceResponse.statusCode, message, response);
                        }
                    }
                );
        }
    }
    // Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Google", 500, message);
    }
};

// Google language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.google.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.langDetection.requiredData",
        checkLangDetectionError: "adaptiveContentService.handlers.translation.google.langDetection.checkLangDetectionError",
        isLangUndefined: "adaptiveContentService.handlers.translation.google.langDetection.isLangUndefined",
        constructResponse: "adaptiveContentService.handlers.translation.google.langDetection.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.langDetection.getLang"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.langDetection.requiredData = function (text) {
    var promise = fluid.promise();

    googleTranslate.detectLanguage(text, function (err, detection) {
        if (err) {

            // error making request
            if (err.body === undefined) {
                ACS.log("Error making request to the Google Service (Detect-Translate endpoint)");
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error : Error with making request to the external service (Google)"
                    }
                });
            }
            else {
                var errorBody = JSON.parse(err.body);

                promise.resolve({
                    statusCode: errorBody.error.code,
                    body: errorBody
                });
            }
        }
        else {
            promise.resolve({
                statusCode: 200,
                body: detection
            });
        }
    });

    return promise;
};

// check if the detected language is undefined, i.e. language could not be detected
adaptiveContentService.handlers.translation.google.langDetection.isLangUndefined = function (serviceResponse) {
    if (serviceResponse.body.language === "und") {
        return {
            statusCode: 404,
            errorMessage: "Language could not be detected from the text provided"
        };
    }
    else {
        return false;
    }
};

// function to catch the error content from the Google service resopnse
adaptiveContentService.handlers.translation.google.langDetection.checkLangDetectionError = function (serviceResponse, that) {
    var undefinedLangErrorContent = that.isLangUndefined(serviceResponse);

    // langDetection-specific errors
    if (serviceResponse.statusCode === 200 && undefinedLangErrorContent) {
        return undefinedLangErrorContent;
    }
    // general translation errors
    else {
        var errorContent = that.checkCommonGoogleErrors(serviceResponse);

        return errorContent;
    }
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.langDetection.constructResponse = function (serviceResponse) {
    return {
        sourceText: serviceResponse.body.originalText,
        langCode: serviceResponse.body.language
    };
};

// Google language detection handler
adaptiveContentService.handlers.translation.google.langDetection.getLang = function (request, version, that) {
    var text = request.req.body.text;

    try {
        var characterLimit = that.options.characterLimit;

        var langsObj = false;

        // check for errors before making request to the service
        var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, googleApiKey, langsObj, text, that);

        if (preRequestErrorContent) {
            that.sendErrorResponse(request, version, "Google", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
        }
        else {
            that.requiredData(text)
                .then(
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkLangDetectionError(serviceResponse, that);

                        // Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Google", errorContent.statusCode, errorContent.errorMessage);
                        }
                        // No error response
                        else {
                            var message = "Language Detection Successful",
                                response = that.constructResponse(serviceResponse);

                            that.sendSuccessResponse(request, version, "Google", serviceResponse.statusCode, message, response);
                        }
                    }
                );
        }
    }
    // Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Google", 500, message);
    }
};

// Google language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.google.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.listLanguages.requiredData",
        constructResponse: "adaptiveContentService.handlers.translation.google.listLanguages.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.listLanguages.getLangList"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.listLanguages.requiredData = function () {
    var promise = fluid.promise();

    googleTranslate.getSupportedLanguages(function (err, languageCodes) {
        if (err) {

            // error making request
            if (err.body === undefined) {
                ACS.log("Error making request to the Google Service (Detect-Translate endpoint)");
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error : Error with making request to the external service (Google)"
                    }
                });
            }
            else {
                var errorBody = JSON.parse(err.body);

                promise.resolve({
                    statusCode: errorBody.error.code,
                    body: errorBody
                });
            }
        }
        else {
            promise.resolve({
                statusCode: 200,
                body: languageCodes
            });
        }
    });

    return promise;
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.listLanguages.constructResponse = function (serviceResponse) {
    return {
        languagesCodes: serviceResponse.body
    };
};

// google get all supported languages handler
adaptiveContentService.handlers.translation.google.listLanguages.getLangList = function (request, version, that) {
    try {

        // check for errors before making request to the service
        var serviceKeyErrorContent = that.checkServiceKey(googleApiKey);

        // error with the service key
        if (serviceKeyErrorContent) {
            that.sendErrorResponse(request, version, "Google", serviceKeyErrorContent.statusCode, serviceKeyErrorContent.errorMessage);
        }
        else {
            that.requiredData()
                .then (
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkCommonGoogleErrors(serviceResponse, that);

                        // Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Google", errorContent.statusCode, errorContent.errorMessage);
                        }
                        // No error response
                        else {
                            var message = "Available languages fetched successfully",
                                response = that.constructResponse(serviceResponse);

                            that.sendSuccessResponse(request, version, "Google", serviceResponse.statusCode, message, response);
                        }
                    }
                );
        }
    }
    // error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Google", 500, message);
    }
};
