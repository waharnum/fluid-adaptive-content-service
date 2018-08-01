"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.middleware.versionCheck", {
    gradeNames: "kettle.middleware",
    version: "v1",
    invokers: {
        handle: {
            funcName: "adaptiveContentService.middleware.versionCheck.handler",
            args: ["{arguments}.0", "{that}"]
        }
    }
});

adaptiveContentService.middleware.versionCheck.handler = function (request, that) {
    var promise = fluid.promise(),
        version = request.req.params.version;

    if (version === that.options.version) {
        promise.resolve();
    }
    else {
        promise.reject({
            statusCode: 400,
            message: "Unknown api version - '" + version + "'",
            jsonResponse: {}
        });
    }

    return promise;
};
