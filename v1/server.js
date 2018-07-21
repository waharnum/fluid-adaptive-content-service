"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.serverConfig", {
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
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/:language/definition/:word",
                                    "method": "get"
                                },
                                generalSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                generalAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                generalPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                generalFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                generalExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                wikiDefinitionHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/wiktionary/:language/definition/:word",
                                    "method": "get"
                                },
                                wikiSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                wikiAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                wikiPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                wikiFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                wikiExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                oxfordDefinitionHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.definition",
                                    "route": "/:version/dictionary/oxford/:language/definition/:word",
                                    "method": "get"
                                },
                                oxfordSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/oxford/:language/synonyms/:word",
                                    "method": "get"
                                },
                                oxfordAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/oxford/:language/antonyms/:word",
                                    "method": "get"
                                },
                                oxfordPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/oxford/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                oxfordFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word",
                                    "method": "get"
                                },
                                oxfordExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                oxfordLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.languages",
                                    "route": "/:version/dictionary/oxford/languages",
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
                                    "type": "adaptiveContentService.handlers.nlp.compromise.sentenceTagging",
                                    "route": "/:version/nlp/compromise/tags/",
                                    "method": "post"
                                }
                            }
                        }
                    },
                    translationApp: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                yandexTranslateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.translateText",
                                    "route": "/:version/translation/yandex/:sourceLang-:targetLang",
                                    "method": "post"
                                },
                                yandexLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.langDetection",
                                    "route": "/:version/translation/yandex/detect",
                                    "method": "post"
                                },
                                yandexDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.detectAndTranslate",
                                    "route": "/:version/translation/yandex/:targetLang",
                                    "method": "post"
                                },
                                googleLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.langDetection",
                                    "route": "/:version/translation/google/detect",
                                    "method": "post"
                                },
                                googleListLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.listLanguages",
                                    "route": "/:version/translation/google/languages",
                                    "method": "get"
                                },
                                googleTranslateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.translateText",
                                    "route": "/:version/translation/google/:sourceLang-:targetLang",
                                    "method": "post"
                                }
                            }
                        }
                    }
                },
                events: {
                    onListen: null
                },
                listeners: {
                    onListen: "adaptiveContentService.serverConfig.checkServiceKeys"
                }
            }
        }
    }
});

adaptiveContentService.serverConfig.checkServiceKeys = function () {
    adaptiveContentService.handlerUtils.checkOxfordServiceKeys();
    adaptiveContentService.handlerUtils.checkTranslationServiceKeys();
};

require("./dictionary/handlers");
require("./nlp/handlers");
require("./translation/handlers");

adaptiveContentService.serverConfig();
