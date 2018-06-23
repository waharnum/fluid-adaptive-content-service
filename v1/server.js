"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");

require("kettle");

fluid.defaults("adaptiveContentServices.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8080,
                components: {
                    dictionaryApp: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                generalDefinitionHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/:language/definition/:word",
                                    "method": "get"
                                },
                                generalSynonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                generalAntonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                generalPronunciationsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                generalFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                generalExtendedFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                wikiDefinitionHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/wiktionary/:language/definition/:word",
                                    "method": "get"
                                },
                                wikiSynonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                wikiAntonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                wikiPronunciationsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                wikiFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                wikiExtendedFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                oxfordDefinitionHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.definition",
                                    "route": "/:version/dictionary/oxford/:language/definition/:word",
                                    "method": "get"
                                },
                                oxfordSynonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/oxford/:language/synonyms/:word",
                                    "method": "get"
                                },
                                oxfordAntonymsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/oxford/:language/antonyms/:word",
                                    "method": "get"
                                },
                                oxfordPronunciationsHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/oxford/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                oxfordFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word",
                                    "method": "get"
                                },
                                oxfordExtendedFrequencyHandler: {
                                    "type": "adaptiveContentServices.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                }
                            }
                        }
                    },
                    nlpApp: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                compromiseSentenceTaggingHandler: {
                                    "type": "adaptiveContentServices.handlers.nlp.compromise.sentenceTagging",
                                    "route": "/:version/nlp/compromise/tags/",
                                    "method": "post"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

require("./dictionary/handlers");
require("./nlp/handlers");

adaptiveContentServices.serverConfig();
