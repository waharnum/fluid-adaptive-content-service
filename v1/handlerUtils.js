/* Some common functions used by all services */

"use strict";

var fluid = require("infusion"),
    adaptiveContentService = {},
    kettle = require("kettle"),
    ACS = fluid.registerNamespace("ACS");

adaptiveContentService.handlerUtils = fluid.registerNamespace("adaptiveContentService.handlerUtils");

require("../index");

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

// Check presence of Oxford API keys
adaptiveContentService.handlerUtils.checkOxfordServiceKeys = function () {
    var oxfordAppId = kettle.resolvers.env("OXFORD_APP_ID");
    var oxfordAppKey = kettle.resolvers.env("OXFORD_APP_KEY");

    if (!oxfordAppId) {
        ACS.log("WARNING! Oxford 'App ID' not found. Refer README for instructions to adding it.");
    }

    if (!oxfordAppKey) {
        ACS.log("WARNING! Oxford 'App Key' not found. Refer README for instructions to adding it.");
    }
};

// Check presence of Yandex API keys
adaptiveContentService.handlerUtils.checkYandexServiceKeys = function () {
    var yandexAppKey = kettle.resolvers.env("YANDEX_APP_KEY");

    if (!yandexAppKey) {
        ACS.log("WARNING! Yandex 'App Key' not found. Refer README for instructions to adding it.");
    }
};
