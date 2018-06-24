"use strict";

var fluid = require("infusion");
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

require("../handlerUtils");

var nlp = require("compromise");//npm package that provides NLP services

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
    }
});

adaptiveContentService.handlers.nlp.compromise.sentenceTagging.getTags = function (request, that) {
    var version = request.req.params.version;
    var sentence = request.req.body.sentence;
    try {
        if (sentence) {
            if (sentence.length <= that.options.characterLimit) {
                var sentenceData = nlp(sentence);
                var tags = sentenceData.out("tags");

                //setting the required headers for the response
                request.res.set({
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                });

                var response = {
                    sentence: sentence,
                    termsArray: [],
                    tagsArray: []
                };

                var i;
                for (i = 0; i < tags.length; i++) {
                    response.termsArray.push(tags[i].text);
                    response.tagsArray.push(tags[i].tags);
                }

                var message = "Sentence Tagged";
                that.sendSuccessResponse(request, version, "Compromise", 200, message, response);
            }
            else {
                // Too long sentence
                var message = "Sentence in request body should have character count less than or equal to " + that.options.characterLimit;

                that.sendErrorResponse(request, version, "Compromise", 413, message);
            }
        }
        else {
            // No sentence field in request body
            var message = "Request body doesn't contain 'sentence' field";

            that.sendErrorResponse(request, version, "Compromise", 400, message);
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;
        that.sendErrorResponse(request, version, "Compromise", 501, message);
    }
};
