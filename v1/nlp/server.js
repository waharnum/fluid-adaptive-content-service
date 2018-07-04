"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.nlp.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8082,
                components: {
                    app: {
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
                    }
                }
            }
        }
    }
});

require("./handlers.js");

adaptiveContentService.nlp.serverConfig();
