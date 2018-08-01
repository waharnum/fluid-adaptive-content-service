"use strict";

var fluid = require("infusion");

require("../share/utils");
require("../share/handlerUtils");

require("kettle");
require("./commonMiddleware");

fluid.defaults("adaptiveContentService.handlers.commonMiddleware", {
    requestMiddleware: {
        "versionCheck": {
            middleware: "{server}.versionCheck"
        }
    }
});
