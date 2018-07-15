"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS"),
    makeRequest = require("request"),//npm package used to make requests to third-party services used
    cheerio = require("cheerio");//npm package used for scrapping html responses

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");
require("../../../index");


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
        requiredDataImpl: "adaptiveContentService.handlers.dictionary.oxford.requiredData",
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
    var authHeaders = {
        "app_id": that.options.authenticationOptions.app_id,
        "app_key": that.options.authenticationOptions.app_key
    };

    return authHeaders;
};

//function  to catch the errors for oxford service
adaptiveContentService.handlers.dictionary.oxford.checkDictionaryError = function (serviceResponse) {
    var OXFORD_ERROR_CODES = [400, 403, 404, 500, 502, 503, 504];

    //Check if there is an error
    if (serviceResponse.statusCode !== 200) {

        //Handles all the errors together
        if (OXFORD_ERROR_CODES.indexOf(serviceResponse.statusCode) >= 0) {
            return {
                statusCode: serviceResponse.statusCode,
                responseBody: serviceResponse.body
            };
        }

        //Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 501,
                responseBody: "The error hasn\'t been handled yet"
            };
        }
    }
};

//function to scrape the error message from the html response given by oxford
adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape = function (htmlResponse) {
    var $ = cheerio.load(htmlResponse),
        isHTML = $("h1").text(); //check if the response is in html

    //if the error msg is in html format (oxford's format)
    if (isHTML) {
        var message = $("h1").text() + ": " + $("p").text();
        return message;
    }
    //if the error msg is in plain text format
    else {
        return htmlResponse;
    }
};

//function to get the required data from the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.requiredData = function (url, requestHeaders) {
    var promise = fluid.promise();

    makeRequest(
        {
            url: url,
            headers: requestHeaders
        },
        function (error, response, body) {
            if (error) {
                ACS.log("Error making request to the Oxford Service (Definition Endpoint)");
                promise.resolve({
                    statusCode: 500,
                    body: "Internal server error : Error with making request to the external service (Oxford) - " + error
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

//Oxford definition grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.definition", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.definition.constructResponse"
    }
});

//Oxford definition handler
adaptiveContentService.handlers.dictionary.oxford.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var requestHeaders = that.serviceKeysImpl(that),
                urlBase = that.options.serviceConfig.urlBase,
                url = urlBase + "entries/" + lang + "/" + word;

            that.requiredDataImpl(url, requestHeaders)
                .then(
                    function (result) {
                        var serviceResponse = result,
                            errorContent = that.checkDictionaryErrorImpl(serviceResponse),
                            message;

                        //Error Responses
                        if (errorContent) {
                            message = that.errorMsgScrape(errorContent.responseBody);
                            var statusCode = errorContent.statusCode;

                            that.sendErrorResponse(request, version, "Oxford", statusCode, message);
                        }
                        //No error : Word found
                        else {
                            message = "Word Found";

                            var jsonServiceResponse = JSON.parse(serviceResponse.body),
                                response = that.constructResponse(jsonServiceResponse);

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

//function to construct a useful response from the data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.definition.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement) {
        var currentResponseEntry = {};

        currentResponseEntry.category = lexicalEntryElement.lexicalCategory;

        currentResponseEntry.definitions = [];

        var entries = lexicalEntryElement.entries;
        fluid.each(entries, function (entryElement) {
            var senses = entryElement.senses;
            fluid.each(senses, function (senseElement) {
                if (senseElement.definitions) {
                    currentResponseEntry.definitions = currentResponseEntry.definitions.concat(senseElement.definitions);
                }

                var subsenses = senseElement.subsenses;
                if (subsenses) {
                    fluid.each(subsenses, function (subsenseElement) {
                        currentResponseEntry.definitions = currentResponseEntry.definitions.concat(subsenseElement.definitions);
                    });
                }
            });
        });

        response.entries.push(currentResponseEntry);
    });

    return response;
};

//Oxford synonyms grade
fluid.defaults("adaptiveContentService.handlers.dictionary.oxford.synonyms", {
    gradeNames: "adaptiveContentService.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.oxford.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.synonyms.constructResponse"
    }
});

//Oxford synonyms handler
adaptiveContentService.handlers.dictionary.oxford.synonyms.getSynonyms = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse,
                errorContent,
                requestHeaders = that.serviceKeysImpl(that),
                urlBase = that.options.serviceConfig.urlBase,
                url = urlBase + "entries/" + lang + "/" + word + "/synonyms";

            that.requiredDataImpl(url, requestHeaders)
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

                            var jsonServiceResponse = JSON.parse(serviceResponse.body),
                                response = that.constructResponse(jsonServiceResponse);

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

//function to construct a useful response from the synonyms data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.synonyms.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement) {
        var currentResponseEntry = {};

        currentResponseEntry.category = lexicalEntryElement.lexicalCategory;
        currentResponseEntry.senses = [];

        var entries = lexicalEntryElement.entries;

        fluid.each(entries, function (entryElement) {

            var senses = entryElement.senses;

            fluid.each(senses, function (senseElement) {
                var currentSenseEntry = {
                    examples: [],
                    synonyms: []
                };

                var examples = senseElement.examples;
                if (examples) {
                    fluid.each(examples, function (exampleElement) {
                        currentSenseEntry.examples.push(exampleElement.text);
                    });
                }

                var synonyms = senseElement.synonyms;
                if (synonyms) {
                    fluid.each(synonyms, function (synonymElement) {
                        currentSenseEntry.synonyms.push(synonymElement.text);
                    });
                }

                var subsenses = senseElement.subsenses;
                if (subsenses) {
                    fluid.each(subsenses, function (subsenseElement) {
                        var subsenseSynonyms = subsenseElement.synonyms;
                        if (subsenseSynonyms) {
                            fluid.each(subsenseSynonyms, function (subsenseSynonymElement) {
                                currentSenseEntry.synonyms.push(subsenseSynonymElement.text);
                            });
                        }
                    });
                }

                currentResponseEntry.senses.push(currentSenseEntry);
            });
        });

        response.entries.push(currentResponseEntry);
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
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse"
    }
});

//Oxford antonyms handler
adaptiveContentService.handlers.dictionary.oxford.antonyms.getAntonyms = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse,
                errorContent,
                requestHeaders = that.serviceKeysImpl(that),
                urlBase = that.options.serviceConfig.urlBase,
                url = urlBase + "entries/" + lang + "/" + word + "/antonyms";

            that.requiredDataImpl(url, requestHeaders)
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

                            var jsonServiceResponse = JSON.parse(serviceResponse.body),
                                response = that.constructResponse(jsonServiceResponse);

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

//function to construct a useful response from the antonyms data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.antonyms.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement) {
        var currentResponseEntry = {};

        currentResponseEntry.category = lexicalEntryElement.lexicalCategory;
        currentResponseEntry.senses = [];

        var entries = lexicalEntryElement.entries;

        fluid.each(entries, function (entryElement) {

            var senses = entryElement.senses;

            fluid.each(senses, function (senseElement) {
                var currentSenseEntry = {
                    examples: [],
                    antonyms: []
                };

                var examples = senseElement.examples;
                if (examples) {
                    fluid.each(examples, function (exampleElement) {
                        currentSenseEntry.examples.push(exampleElement.text);
                    });
                }

                var antonyms = senseElement.antonyms;
                if (antonyms) {
                    fluid.each(antonyms, function (synonymElement) {
                        currentSenseEntry.antonyms.push(synonymElement.text);
                    });
                }

                var subsenses = senseElement.subsenses;
                if (subsenses) {
                    fluid.each(subsenses, function (subsenseElement) {
                        var subsenseAntonyms = subsenseElement.antonyms;
                        if (subsenseAntonyms) {
                            fluid.each(subsenseAntonyms, function (subsenseSynonymElement) {
                                currentSenseEntry.antonyms.push(subsenseSynonymElement.text);
                            });
                        }
                    });
                }

                currentResponseEntry.senses.push(currentSenseEntry);
            });
        });

        response.entries.push(currentResponseEntry);
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
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.pronunciations.constructResponse"
    }
});

//Oxford pronunciations handler
adaptiveContentService.handlers.dictionary.oxford.pronunciations.getPronunciations = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse,
                errorContent,
                requestHeaders = that.serviceKeysImpl(that),
                urlBase = that.options.serviceConfig.urlBase,
                url = urlBase + "entries/" + lang + "/" + word;

            that.requiredDataImpl(url, requestHeaders)
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

//function to construct a useful response from the pronunciation data provided by the Oxford Service
adaptiveContentService.handlers.dictionary.oxford.pronunciations.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.results[0].id,
        entries: []
    };

    var rootPronunciations = jsonServiceResponse.results[0].pronunciations;
    if (rootPronunciations) {
        var currentResponseEntry = {
            category: "",
            pronunciations: []
        };

        fluid.each(rootPronunciations, function (element) {
            currentResponseEntry.pronunciations.push(element);
        });

        response.entries.push(currentResponseEntry);
    }

    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    fluid.each(lexicalEntries, function (lexicalEntryElement) {
        var currentResponseEntry = {
            category: lexicalEntryElement.lexicalCategory,
            pronunciations: []
        };

        var pronunciations = lexicalEntryElement.pronunciations;
        if (pronunciations) {
            fluid.each(pronunciations, function (pronunciationElement) {
                currentResponseEntry.pronunciations.push(pronunciationElement);
            });
        }

        var entries = lexicalEntryElement.entries;
        fluid.each(entries, function (entryElement) {
            pronunciations = entryElement.pronunciations;
            if (pronunciations) {
                fluid.each(pronunciations, function (pronunciationElement) {
                    currentResponseEntry.pronunciations.push(pronunciationElement);
                });
            }

            var senses = entryElement.senses;
            fluid.each(senses, function (senseElement) {
                pronunciations = senseElement.pronunciations;
                if (pronunciations) {
                    fluid.each(pronunciations, function (pronunciationElement) {
                        currentResponseEntry.pronunciations.push(pronunciationElement);
                    });
                }
            });
        });

        response.entries.push(currentResponseEntry);
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
        constructResponse: "adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse"
    }
});

//Oxford frquency handler
adaptiveContentService.handlers.dictionary.oxford.frequency.getFrequency = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Oxford")) {
            var serviceResponse,
                errorContent,
                lexicalCategory = request.req.params.lexicalCategory,
                requestHeaders = that.serviceKeysImpl(that),
                urlBase = that.options.serviceConfig.urlBase,
                url;

            if (lexicalCategory) {
                url = urlBase + "stats/frequency/word/" + lang + "/?lemma=" + word + "&lexicalCategory=" + lexicalCategory;
            }
            else {
                url = urlBase + "stats/frequency/word/" + lang + "/?lemma=" + word;
            }

            that.requiredDataImpl(url, requestHeaders)
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

                            var jsonServiceResponse = JSON.parse(serviceResponse.body),
                                response = that.constructResponse(jsonServiceResponse);

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
