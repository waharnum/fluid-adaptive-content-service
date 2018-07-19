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
        // checkLangDetectionError: "adaptiveContentService.handlers.translation.google.checkLangDetectionError",
        // isLangResponseEmpty: "adaptiveContentService.handlers.translation.google.isLangResponseEmpty",
        constructResponse: "fluid.notImplemented",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

//TEST: function to catch the error content from the google service resopnse
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

//TEST: function to construct a response from the data provided by the Google service
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
