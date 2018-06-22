"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");

var nlp = require("compromise");//npm package that provides NLP services

fluid.defaults("adaptiveContentServices.handlers.nlp.compromise.sentenceTagging", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: "adaptiveContentServices.handlers.nlp.compromise.sentenceTagging.getTags"
    }
});

adaptiveContentServices.handlers.nlp.compromise.sentenceTagging.getTags = function (request) {
    var version = request.req.params.version;
    var sentence = request.req.body.sentence;
    var sentenceData = nlp(sentence);
    try {
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

        request.events.onSuccess.fire({
            version: version,
            service: {
                name: "Natural Language Processing (NLP)",
                source: "Compromise"
            },
            statusCode: 200,
            message: "Sentence Tagged",
            jsonResponse: response
        });
    }
    //Error with the API code
    catch (error) {
        request.events.onError.fire({
            version: version,
            service: {
                name: "Natural Language Processing (NLP)",
                source: "Compromise"
            },
            statusCode: 501,
            message: "Internal Server Error: " + error,
            jsonResponse: {}
        });
    }
};
