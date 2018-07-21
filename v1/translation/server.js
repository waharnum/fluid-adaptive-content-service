"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.translation.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8083,
                components: {
                    app: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                yandexTranslateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.translateText",
                                    "route": "/:version/translation/yandex/translate/:sourceLang-:targetLang",
                                    "method": "post"
                                },
                                yandexLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.langDetection",
                                    "route": "/:version/translation/yandex/detect",
                                    "method": "post"
                                },
                                yandexDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.detectAndTranslate",
                                    "route": "/:version/translation/yandex/translate/:targetLang",
                                    "method": "post"
                                },
                                yandexListLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.listLanguages",
                                    "route": "/:version/translation/yandex/languages",
                                    "method": "get"
                                },
                                googleDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.detectAndTranslate",
                                    "route": "/:version/translation/google/translate/:targetLang",
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
                                }
                            }
                        }
                    }
                },
                events: {
                    onListen: null
                },
                listeners: {
                    onListen: "adaptiveContentService.handlerUtils.checkTranslationServiceKeys"
                }
            }
        }
    }
});

require("./handlers.js");

adaptiveContentService.translation.serverConfig();
