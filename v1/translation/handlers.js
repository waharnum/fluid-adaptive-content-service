"use strict";

var fluid = require("infusion"),
    makeRequest = require("request");//npm package used to make requests to third-party services used

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");
require("../handlerUtils");

//TEMPORARY:
// require("../../share/translation/tests/nock/mockYandexTranslation");

//Yandex translation grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.translateText", {
    gradeNames: "kettle.request.http",
    authenticationOptions: {
        "app_key": "@expand:kettle.resolvers.env(YANDEX_APP_KEY)"
    },
    characterLimit: 500,
    invokers: {
        handleRequest: {
            funcName: "adaptiveContentService.handlers.translation.yandex.translateText.getTranslation",
            args: ["{arguments}.0", "{that}"]
        },
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Translation"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Translation"]
        },
        requiredData: "adaptiveContentService.handlers.translation.yandex.translateText.requiredData",
        checkSourceText: "adaptiveContentService.handlers.translation.yandex.translateText.checkSourceText",
        serviceKey: {
            funcName: "adaptiveContentService.handlers.translation.yandex.translateText.serviceKey",
            args: ["{that}"]
        },
        checkServiceKey: "adaptiveContentService.handlers.translation.yandex.translateText.checkServiceKey",
        checkTranslationError: "adaptiveContentService.handlers.translation.yandex.translateText.checkTranslationError"
    }
});

// TEST: check for errors with the service keys present in environment variables
adaptiveContentService.handlers.translation.yandex.translateText.checkServiceKey = function (serviceKey) {
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
adaptiveContentService.handlers.translation.yandex.translateText.serviceKey = function (that) {
    var serviceKey = that.options.authenticationOptions.app_key;

    return serviceKey;
};

//function to get the required translation data from yandex
adaptiveContentService.handlers.translation.yandex.translateText.requiredData = function (sourceLang, targetLang, text, serviceKey) {
    var promise = fluid.promise();

    makeRequest.post(
        {
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + serviceKey + "&lang=" + sourceLang + "-" + targetLang,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error - " + error
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

// TESTED: check for errors in the text provided in the request body
adaptiveContentService.handlers.translation.yandex.translateText.checkSourceText = function (sourceText, characterLimit) {
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

//function to catch the error content from the yandex service resopnse
adaptiveContentService.handlers.translation.yandex.translateText.checkTranslationError = function (serviceResponse) {
    console.log(serviceResponse);
};

//Yandex translate text handler
adaptiveContentService.handlers.translation.yandex.translateText.getTranslation = function (request, that) {
    var version = request.req.params.version,
        sourceLang = request.req.params.sourceLang,
        targetLang = request.req.params.targetLang,
        text = request.req.body.text;

    try {

        //Error with the text in request body
        var characterLimit = that.options.characterLimit,
            sourceTextErrorContent = that.checkSourceText(text, characterLimit);

        if (sourceTextErrorContent) {
            that.sendErrorResponse(request, version, "Yandex", sourceTextErrorContent.statusCode, sourceTextErrorContent.errorMessage);
        }
        //No error with the text in request body
        else {
            var serviceKey = that.serviceKey(),
                serviceKeyErrorContent = that.checkServiceKey(serviceKey);

            if (serviceKeyErrorContent) {
                that.sendErrorResponse(request, version, "Yandex", serviceKeyErrorContent.statusCode, serviceKeyErrorContent.errorMessage);
            }
            else {
                that.requiredData(sourceLang, targetLang, text, serviceKey)
                    .then(
                        function (result) {
                            // var serviceResponse = result,
                            //     errorContent = that.checkTranslationError(serviceResponse),
                            //     message;

                            //     console.log(errorContent);
                            console.log(result);
                        }
                    );
            }
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Erro: " + error;

        that.sendErrorResponse(request, version, "Yandex", 500, message);
    }
};
