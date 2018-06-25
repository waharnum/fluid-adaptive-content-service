"use strict";

var fluid = require("infusion");
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

require("../handlerUtils");

var nlp = require("compromise");//npm package that provides NLP services

// Compromise sentence tagging grade
fluid.defaults("adaptiveContentService.handlers.nlp.compromise.sentenceTagging", {
    gradeNames: "kettle.request.http",
    characterLimit: 10000,
    invokers: {
        handleRequest: {
            funcName: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.getTags",
            args: ["{arguments}.0", "{that}"]
        },
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Natural Language Processing (NLP)"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Natural Language Processing (NLP)"]
        },
        checkNlpError: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError",
        requiredData: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.requiredData",
        constructResponse: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.constructResponse"
    }
});

// function to catch the errors for the compromise's sentence tagging
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError = function (sentence, characterLimit) {
    if (sentence) {
        if (sentence.length > characterLimit) {
            return {
                statusCode: 413,
                errorMessage: "Sentence in request body should have character count less than or equal to " + characterLimit
            };
        }
        else {
            return;
        }
    }
    else {
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'sentence' field"
        };
    }
};

// get the required data from the compromise service
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.requiredData = function (sentence) {
    var sentenceData = nlp(sentence);
    var tags = sentenceData.out("tags");
    return tags;
};

adaptiveContentService.handlers.nlp.compromise.sentenceTagging.constructResponse = function (sentence, serviceTags) {
    var response = {
        sentence: sentence,
        termsArray: [],
        tagsArray: []
    };

    fluid.each(serviceTags, function (item) {
        response.termsArray.push(item.text);
        response.tagsArray.push(item.tags);
    });

    return response;
};

// Compromise sentence tagging handler
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.getTags = function (request, that) {
    var version = request.req.params.version;
    var sentence = request.req.body.sentence;
    var message;
    try {
        var errorContent = that.checkNlpError(sentence, that.options.characterLimit);

        if (errorContent) {
            that.sendErrorResponse(request, version, "Compromise", errorContent.statusCode, errorContent.errorMessage);
        }
        else {
            var tags = that.requiredData(sentence);

            //setting the required headers for the response
            request.res.set({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            });

            var response = that.constructResponse(sentence, tags);

            message = "Sentence Tagged";
            that.sendSuccessResponse(request, version, "Compromise", 200, message, response);
        }
    }
    //Error with the API code
    catch (error) {
        message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Compromise", 501, message);
    }
};
