"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");
var wd = require("word-definition");
var makeRequest = require("request");//npm package used to make requests to third-party services used
var cheerio = require("cheerio");//npm package used for scrapping html responses

require("dotenv").config();//npm package to get variables from '.env' file

require("kettle");

/* Abstract grade for dictionary service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentServices.handlers.dictionary", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            func: "{that}.commonDictionaryDispatcher",
            args: ["{arguments}.0", "{that}.dictionaryHandlerImpl", "{that}"]
        },
        commonDictionaryDispatcher: "adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher",
        uriErrHandler: {
            funcName: "adaptiveContentServices.handlers.dictionary.uriErrHandler",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        sendSuccessResponse: "adaptiveContentServices.handlers.dictionary.sendSuccessResponse",
        sendErrorResponse: "adaptiveContentServices.handlers.dictionary.sendErrorResponse",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "fluid.notImplemented"
    }
});

//Common dispatcher for all dictionary endpoints
adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher = function (request, serviceSpecificImp, that) {
    var version = request.req.params.version;
    var word = request.req.params.word;
    var lang = request.req.params.language;

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    serviceSpecificImp(request, version, word, lang, that);
};

/* Common function for all the dictionary endpoints
 * to check for long uri
 */
adaptiveContentServices.handlers.dictionary.uriErrHandler = function (request, version, word, serviceName, that) {
    if (word.length > 128) {
        var message = "Request URI too long: \"word\" can have maximum 128 characters";

        that.sendErrorResponse(request, version, serviceName, 414, message);
        return true;
    }
    else {
        return false;
    }
};

// Common function for all dictionary endpoints to send success response
adaptiveContentServices.handlers.dictionary.sendSuccessResponse = function (request, version, serviceName, statusCode, message, jsonResponse) {
    request.events.onSuccess.fire({
        version: version,
        service: {
            name: "Dictionary",
            source: serviceName
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: jsonResponse
    });
};

adaptiveContentServices.handlers.dictionary.sendErrorResponse = function (request, version, serviceName, statusCode, message) {
    request.events.onError.fire({
        version: version,
        service: {
            name: "Dictionary",
            source: serviceName
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: {}
    });
};

//Specific grade for Wiktionary
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented"
    }
});

//function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

    //Check if there is an error
    if (serviceResponse.err) {

        //Word not found
        if (serviceResponse.err === "not found") {
            return {
                statusCode: 404,
                errorMessage: "Word not found"
            };
        }

        //Language unsupported by the third-party service
        else if (serviceResponse.err === "unsupported language") {
            return {
                statusCode: 404,
                errorMessage: "Unsupported Language: Only English (en), French (fr) and German (de) are supported right now"
            };
        }

        //Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 500,
                errorMessage: "The error hasn\"t been handled yet"
            };
        }
    }

    //Return false if no error found
    else {
        return;
    }
};

//Wiktionary definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData"
    }
});

//Wiktionary definition handler
adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Wiktionary")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Wiktionary", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";
                        var jsonResponse = {
                            word: serviceResponse.word,
                            entries: [
                                {
                                    category: serviceResponse.category,
                                    definitions: [serviceResponse.definition]
                                }
                            ]
                        };

                        that.sendSuccessResponse(request, version, "Wiktionary", 200, "Word Found", jsonResponse);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Wiktionary", 500, message);
    }
};

//function to get definition from the wiktionary service
adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });
    return promise;
};

//Wiktionary synonyms grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.synonyms", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.requiredData"
    }
});

//Wiktionary synonyms handler
adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.getSynonyms = function (request, version, that) {
    var message = "This Service doesn't provide synonyms";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.synonyms.requiredData = function () {
  /*
   * Service doesn't provide synonyms
   * So no data required
   */
};

//Wiktionary antonyms grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.antonyms", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.getAntonyms",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.requiredData"
    }
});

//Wiktionary antonyms handler
adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.getAntonyms = function (request, version, that) {
    var message = "This Service doesn't provide antonyms";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.antonyms.requiredData = function () {
  /*
   * Service doesn't provide antonyms
   * So no data required
   */
};

//Wiktionary pronunciations grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.getPronunciations",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.requiredData"
    }
});

//Wiktionary pronunciations handler
adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.getPronunciations = function (request, version, that) {
    var message = "This Service doesn't provide pronunciations";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.pronunciations.requiredData = function () {
  /*
   * Service doesn't provide pronunciations
   * So no data required
   */
};


//Wiktionary frequency grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.frequency", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.frequency.getFrequency",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.frequency.requiredData"
    }
});

//Wiktionary frequency handler
adaptiveContentServices.handlers.dictionary.wiktionary.frequency.getFrequency = function (request, version, that) {
    var message = "This Service doesn't provide frequency";

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.frequency.requiredData = function () {
  /*
   * Service doesn't provide frequency
   * So no data required
   */
};

//Specific grade for Oxford
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
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
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.serviceKeys",
            args: ["{that}"]
        },
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.oxford.checkDictionaryError",
        errorMsgScrape: "adaptiveContentServices.handlers.dictionary.oxford.errorMsgScrape"
    }
});

//function to return object giving oxford key and id (acquired from environment variables)
adaptiveContentServices.handlers.dictionary.oxford.serviceKeys = function (that) {
    var appId = that.options.authenticationOptions.app_id;
    var appKey = that.options.authenticationOptions.app_key;

    var authHeaders = {
        "app_id": appId,
        "app_key": appKey
    };

    return authHeaders;
};

//function  to catch the errors for oxford service
adaptiveContentServices.handlers.dictionary.oxford.checkDictionaryError = function (serviceResponse, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.errorMsgScrape = function (htmlResponse) {
    var $ = cheerio.load(htmlResponse);
    var isHTML = $("h1").text(); //is the response in html

    if (isHTML) {
        var message = $("h1").text() + ": " + $("p").text();
        return message;
    }
    else {
        return htmlResponse;
    }
};

//Oxford definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.definition", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.definition.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

//Oxford definition handler
adaptiveContentServices.handlers.dictionary.oxford.definition.getDefinition = function (request, version, word, lang, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.definition.requiredData = function (lang, word, that) {
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
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.synonyms", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.constructResponse"
    }
});

//Oxford synonyms handler
adaptiveContentServices.handlers.dictionary.oxford.synonyms.getSynonyms = function (request, version, word, lang, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.synonyms.requiredData = function (lang, word, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.synonyms.constructResponse = function (jsonServiceResponse) {
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
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.antonyms", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.antonyms.getAntonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.antonyms.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentServices.handlers.dictionary.oxford.antonyms.constructResponse"
    }
});

//Oxford antonyms handler
adaptiveContentServices.handlers.dictionary.oxford.antonyms.getAntonyms = function (request, version, word, lang, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.antonyms.requiredData = function (lang, word, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.antonyms.constructResponse = function (jsonServiceResponse) {
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
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.pronunciations", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.pronunciations.getPronunciations",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.pronunciations.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        constructResponse: "adaptiveContentServices.handlers.dictionary.oxford.pronunciations.constructResponse"
    }
});

//Oxford pronunciations handler
adaptiveContentServices.handlers.dictionary.oxford.pronunciations.getPronunciations = function (request, version, word, lang, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.pronunciations.requiredData = function (lang, word, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.pronunciations.constructResponse = function (jsonServiceResponse) {
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

        var k;
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
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.frequency", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.frequency.getFrequency",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.frequency.requiredData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        },
        constructResponse: "adaptiveContentServices.handlers.dictionary.oxford.frequency.constructResponse"
    }
});

//Oxford frquency handler
adaptiveContentServices.handlers.dictionary.oxford.frequency.getFrequency = function (request, version, word, lang, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.frequency.requiredData = function (lang, word, lexicalCategory, that) {
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
adaptiveContentServices.handlers.dictionary.oxford.frequency.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.result.lemma,
        frequency: jsonServiceResponse.result.frequency
    };

    if (jsonServiceResponse.result.lexicalCategory) {
        response.lexicalCategory = jsonServiceResponse.result.lexicalCategory;
    }

    return response;
};
