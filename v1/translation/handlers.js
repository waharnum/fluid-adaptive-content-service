"use strict";

var fluid = require("infusion"),
    makeRequest = require("request");//npm package used to make requests to third-party services used

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");
require("../handlerUtils");

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
        checkSourceText: "adaptiveContentService.handlers.translation.yandex.translateText.checkSourceText"
    }
});

adaptiveContentService.handlers.translation.yandex.translateText.requiredData = function (sourceLang, targetLang, text) {
    // var promise = fluid.promise();

    var apiKey = "trnsl.1.1.20180317T094258Z.ad4fd157a0024e3a.0ef6fb779d50af9aa52593dc77a350e7d1e1e12a";

    makeRequest.post(
        {
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + apiKey + "&lang=" + sourceLang + "-" + targetLang,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            console.log(body); 
        }
    )
};

adaptiveContentService.handlers.translation.yandex.translateText.checkSourceText = function (sourceText, characterLimit) {
    //no text found in request body
    if(!sourceText) {
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'text' field"
        }
    }
    //too long text
    else if (sourceText.length > characterLimit) {
        return {
            statusCode: 413,
            errorMessage: "Text in the request body should have character count less than or equal to " + characterLimit
        }
    }
    //No error regarding the request text
    else {
        return false;
    }
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

        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Erro: " + error;

        that.sendErrorResponse(request, version, "Yandex", 500, message);
    }
}
