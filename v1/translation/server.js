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
                                translateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.translateText",
                                    "route": "/:version/translation/yandex/:sourceLang-:targetLang",
                                    "method": "post"
                                },
                                langDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.langDetection",
                                    "route": "/:version/translation/yandex/detect",
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

require("./handlers.js");

adaptiveContentService.translation.serverConfig();
