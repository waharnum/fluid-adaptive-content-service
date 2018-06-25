"use strict";

var fluid = require("infusion");
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

var makeRequest = require("request");//npm package used to make requests to third-party services used
var cheerio = require("cheerio");//npm package used for scrapping html responses
require("dotenv").config();//npm package to get variables from '.env' file

//Specific grade for Oxford
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford", {
    gradeNames: "adaptiveContentService.handlers.dictionary",
    authenticationOptions: {
        "app_id": "@expand:kettle.resolvers.env(OXFORD_APP_ID)",
        "app_key": "@expand:kettle.resolvers.env(OXFORD_APP_KEY)"
    },
    serviceConfig: {
        urlBase: "https://od-api.oxforddictionaries.com/api/v1/"
    },
    invokers: {
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        serviceKeysImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.serviceKeys",
            args: ["{that}"]
        },
        checkDictionaryErrorImpl: "adaptiveContentService.handlers.dictionary.oxford.checkDictionaryError",
        errorMsgScrape: "adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape"
    }
});

//function to return object giving oxford key and id (acquired from environment variables)
adaptiveContentService.handlers.dictionary.oxford.serviceKeys = function (that) {
    var appId = that.options.authenticationOptions.app_id;
    var appKey = that.options.authenticationOptions.app_key;

    var authHeaders = {
        "app_id": appId,
        "app_key": appKey
    };

    return authHeaders;
};

//function  to catch the errors for oxford service
adaptiveContentService.handlers.dictionary.oxford.checkDictionaryError = function (serviceResponse, that) {
    var OXFORD_ERROR_CODES = [400, 403, 404, 414, 500, 502, 503, 504];

    //Check if there is an error
    if (serviceResponse.statusCode !== 200) {

        //Handles all the errors together
        if (OXFORD_ERROR_CODES.indexOf(serviceResponse.statusCode) >= 0) {
            return {
                statusCode: serviceResponse.statusCode,
                errorMessage: that.errorMsgScrape(serviceResponse.body)
            };
        }

        //Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 501,
                errorMessage: "The error hasn\"t been handled yet"
            };
        }
    }
};

//function to scrape the error message from the html response given by oxford
adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape = function (htmlResponse) {
    var $ = cheerio.load(htmlResponse);
    var isHTML = $("h1").text(); //is the response in html
    console.log(htmlResponse);
    if (isHTML) {
        var message = $("h1").text() + ": " + $("p").text();
        return message;
    }
    else {
        return htmlResponse;
    }
};

//Oxford definition grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.definition", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.definition.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

//Oxford definition handler
adaptiveContentService.handlers.dictionary.oxford.definition.getDefinition = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";

                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = {
                            word: word,
                            entries: []
                        };

                        var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
                        fluid.each(lexicalEntries, function (element, index) {
                            response.entries[index] = {
                                category: element.lexicalCategory,
                                definitions: element.entries[0].senses[0].definitions
                            };
                        });

                        that.sendSuccessResponse(request, version, "Oxford", 200, message, response);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Oxford", 500, message);
    }
};

//function to get definition from the oxford service
adaptiveContentService.handlers.dictionary.oxford.definition.requiredData = function (lang, word, that) {
    var promise = fluid.promise();

    var requestHeaders = that.serviceKeysImpl();
    makeRequest(
        {
            url: that.options.serviceConfig.urlBase + "entries/" + lang + "/" + word,
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//Oxford synonyms grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.synonyms", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.synonyms.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.synonyms.constructResponse"
    }
});

//Oxford synonyms handler
adaptiveContentService.handlers.dictionary.oxford.synonyms.getSynonyms = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";

                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = that.constructResponse(jsonServiceResponse);

                        that.sendSuccessResponse(request, version, "Oxford", 200, message, response);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Oxford", 500, message);
    }
};

//function to get the synonyms from the oxford service
adaptiveContentService.handlers.dictionary.oxford.synonyms.requiredData = function (lang, word, that) {
    var promise = fluid.promise();

    var requestHeaders = that.serviceKeysImpl();
    makeRequest(
        {
            url: that.options.serviceConfig.urlBase + "entries/" + lang + "/" + word + "/synonyms",
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//function to construct a useful response from the synonyms data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.synonyms.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement, lexicalEntryIndex) {
        var sensesIndex = 0;

        response.entries[lexicalEntryIndex] = {};

        var currentResponseEntry = response.entries[lexicalEntryIndex];

        currentResponseEntry.category = lexicalEntryElement.lexicalCategory;
        currentResponseEntry.senses = [];

        var entries = lexicalEntryElement.entries;

        fluid.each(entries, function (entryElement) {

            var senses = entryElement.senses;

            fluid.each(senses, function (senseElement) {
                currentResponseEntry.senses[sensesIndex] = {
                    examples: [],
                    synonyms: []
                };

                var examples = senseElement.examples;
                if (examples) {
                    fluid.each(examples, function (exampleElement) {
                        currentResponseEntry.senses[sensesIndex].examples.push(exampleElement.text);
                    });
                }

                var synonyms = senseElement.synonyms;
                if (synonyms) {
                    fluid.each(synonyms, function (synonymElement) {
                        currentResponseEntry.senses[sensesIndex].synonyms.push(synonymElement.text);
                    });
                }

                var subsenses = senseElement.subsenses;
                if (subsenses) {
                    fluid.each(subsenses, function (subsenseElement) {
                        var subsenseSynonyms = subsenseElement.synonyms;
                        if (subsenseSynonyms) {
                            fluid.each(subsenseSynonyms, function (subsenseSynonymElement) {
                                currentResponseEntry.senses[sensesIndex].synonyms.push(subsenseSynonymElement.text);
                            });
                        }
                    });
                }

                sensesIndex++;
            });
        });
    });

    return response;
};

//Oxford antonyms grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.antonyms", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.antonyms.getAntonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.antonyms.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse"
    }
});

//Oxford antonyms handler
adaptiveContentService.handlers.dictionary.oxford.antonyms.getAntonyms = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";

                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = that.constructResponse(jsonServiceResponse);

                        that.sendSuccessResponse(request, version, "Oxford", 200, message, response);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Oxford", 500, message);
    }
};

//function to get the antonyms from the oxford service
adaptiveContentService.handlers.dictionary.oxford.antonyms.requiredData = function (lang, word, that) {
    var promise = fluid.promise();

    var requestHeaders = that.serviceKeysImpl();
    makeRequest(
        {
            url: that.options.serviceConfig.urlBase + "entries/" + lang + "/" + word + "/antonyms",
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//function to construct a useful response from the antonyms data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement, lexicalEntryIndex) {
        var sensesIndex = 0;

        response.entries[lexicalEntryIndex] = {};

        var currentResponseEntry = response.entries[lexicalEntryIndex];

        currentResponseEntry.category = lexicalEntryElement.lexicalCategory;
        currentResponseEntry.senses = [];

        var entries = lexicalEntryElement.entries;

        fluid.each(entries, function (entryElement) {

            var senses = entryElement.senses;

            fluid.each(senses, function (senseElement) {
                currentResponseEntry.senses[sensesIndex] = {
                    examples: [],
                    antonyms: []
                };

                var examples = senseElement.examples;
                if (examples) {
                    fluid.each(examples, function (exampleElement) {
                        currentResponseEntry.senses[sensesIndex].examples.push(exampleElement.text);
                    });
                }

                var antonyms = senseElement.antonyms;
                if (antonyms) {
                    fluid.each(antonyms, function (synonymElement) {
                        currentResponseEntry.senses[sensesIndex].antonyms.push(synonymElement.text);
                    });
                }

                var subsenses = senseElement.subsenses;
                if (subsenses) {
                    fluid.each(subsenses, function (subsenseElement) {
                        var subsenseAntonyms = subsenseElement.antonyms;
                        if (subsenseAntonyms) {
                            fluid.each(subsenseAntonyms, function (subsenseSynonymElement) {
                                currentResponseEntry.senses[sensesIndex].antonyms.push(subsenseSynonymElement.text);
                            });
                        }
                    });
                }

                sensesIndex++;
            });
        });
    });

    return response;
};

//Oxford pronunciations grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.pronunciations", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.pronunciations.getPronunciations",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.pronunciations.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.pronunciations.constructResponse"
    }
});

//Oxford pronunciations handler
adaptiveContentService.handlers.dictionary.oxford.pronunciations.getPronunciations = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = that.constructResponse(jsonServiceResponse);

                        if (response.entries.length === 0) {
                            message = "No pronunciations found for the word \'" + word + "\'";
                            that.sendErrorResponse(request, version, "Oxford", 404, message);
                        }

                        else {
                            message = "Word Found";
                            that.sendSuccessResponse(request, version, "Oxford", 200, message, response);
                        }
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Oxford", 500, message);
    }
};

//function to get the pronunciations link from the oxford service
adaptiveContentService.handlers.dictionary.oxford.pronunciations.requiredData = function (lang, word, that) {
    var promise = fluid.promise();

    var requestHeaders = that.serviceKeysImpl();
    makeRequest(
        {
            url: that.options.serviceConfig.urlBase + "entries/" + lang + "/" + word,
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//function to construct a useful response from the pronunciation data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.pronunciations.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var entryCount = 0;
    var rootPronunciations = jsonServiceResponse.results[0].pronunciations;
    if (rootPronunciations) {
        response.entries[entryCount] = {
            category: "",
            pronunciations: []
        };

        fluid.each(rootPronunciations, function (element, index) {
            response.entries[entryCount].pronunciations[index] = element;
        });
        entryCount++;
    }

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement) {
        response.entries[entryCount] = {
            category: lexicalEntryElement.lexicalCategory,
            pronunciations: []
        };

        var pronunciationCount = 0, pronunciations;
        pronunciations = lexicalEntryElement.pronunciations;
        if (pronunciations) {
            fluid.each(pronunciations, function (pronunciationElement) {
                response.entries[entryCount].pronunciations[pronunciationCount] = pronunciationElement;
                pronunciationCount++;
            });
        }

        var entries = lexicalEntryElement.entries;
        fluid.each(entries, function (entryElement) {
            pronunciations = entryElement.pronunciations;
            if (pronunciations) {
                fluid.each(pronunciations, function (pronunciationElement) {
                    response.entries[entryCount].pronunciations[pronunciationCount] = pronunciationElement;
                    pronunciationCount++;
                });
            }

            var senses = entryElement.senses;
            fluid.each(senses, function (senseElement) {
                pronunciations = senseElement.pronunciations;
                if (pronunciations) {
                    fluid.each(pronunciations, function (pronunciationElement) {
                        response.entries[entryCount].pronunciations[pronunciationCount] = pronunciationElement;
                        pronunciationCount++;
                    });
                }
            });
        });

        entryCount++;
    });

    return response;
};

//Oxford frequency grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.frequency", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.frequency.getFrequency",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.frequency.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse"
    }
});

//Oxford frquency handler
adaptiveContentService.handlers.dictionary.oxford.frequency.getFrequency = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse, errorContent;
            var lexicalCategory = request.req.params.lexicalCategory;

            that.requiredDataImpl(lang, word, lexicalCategory)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";

                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = that.constructResponse(jsonServiceResponse);

                        that.sendSuccessResponse(request, version, "Oxford", 200, message, response);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Oxford", 500, message);
    }
};

//function to get the frequency data from the oxford service
adaptiveContentService.handlers.dictionary.oxford.frequency.requiredData = function (lang, word, lexicalCategory, that) {
    var promise = fluid.promise();

    var requestHeaders = that.serviceKeysImpl();
    var requestURL;

    if (lexicalCategory) {
        requestURL = that.options.serviceConfig.urlBase + "stats/frequency/word/" + lang + "/?lemma=" + word + "&lexicalCategory=" + lexicalCategory;
    }
    else {
        requestURL = that.options.serviceConfig.urlBase + "stats/frequency/word/" + lang + "/?lemma=" + word;
    }

    makeRequest(
        {
            url: requestURL,
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//function to construct a useful response from the frequency data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.result.lemma,
        frequency: jsonServiceResponse.result.frequency
    };

    if (jsonServiceResponse.result.lexicalCategory) {
        response.lexicalCategory = jsonServiceResponse.result.lexicalCategory;
    }

    return response;
};
