/* Some common functions used by all services */

"use strict";

var fluid = require("infusion");
var adaptiveContentServices = {}  ;
adaptiveContentServices.handlerUtils = fluid.registerNamespace("adaptiveContentServices.handlerUtils");

require("kettle");

// Common function for all dictionary endpoints to send success response
adaptiveContentServices.handlerUtils.sendSuccessResponse = function (request, version, serviceSource, statusCode, message, jsonResponse, serviceType) {
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
adaptiveContentServices.handlerUtils.sendErrorResponse = function (request, version, serviceSource, statusCode, message, serviceType) {
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