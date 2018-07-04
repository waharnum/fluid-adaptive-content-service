/* Some common functions used by all services */

"use strict";

var fluid = require("infusion"),
    adaptiveContentService = {};

adaptiveContentService.handlerUtils = fluid.registerNamespace("adaptiveContentService.handlerUtils");

require("kettle");

// Common function for all dictionary endpoints to send success response
adaptiveContentService.handlerUtils.sendSuccessResponse = function (request, version, serviceSource, statusCode, message, jsonResponse, serviceType) {
    request.events.onSuccess.fire({
        version: version,
        service: {
            name: serviceType,
            source: serviceSource
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: jsonResponse
    });
};

// Common function for all dictionary endpoints to send error response
adaptiveContentService.handlerUtils.sendErrorResponse = function (request, version, serviceSource, statusCode, message, serviceType) {
    request.events.onError.fire({
        version: version,
        service: {
            name: serviceType,
            source: serviceSource
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: {}
    });
};
