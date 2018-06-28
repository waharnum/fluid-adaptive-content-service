"use strict";

var fluid = require("infusion");
require("kettle");

var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.utils");

adaptiveContentService.tests.utils = {};

adaptiveContentService.tests.utils.assertStatusCode = function (message, expectedStatusCode, responseStatusCode) {
    jqunit.assertEquals(message, expectedStatusCode, responseStatusCode);
};

//for a given object and array of properties, sort the array into properties that are present in the object and the ones which are absent
adaptiveContentService.tests.utils.objectHasProperties = function (object, properties) {
    var propertiesPresent = [], propertiesAbsent = [];
    fluid.each(properties, function (property) {
        if (object.hasOwnProperty(property)) {
            propertiesPresent.push(property);
        }
        else {
            propertiesAbsent.push(property);
        }

        return {
            present: propertiesPresent,
            absent: propertiesAbsent
        };
    });
};

//for a given array of variables, sort them on the basis of whether they arrays or not
adaptiveContentService.tests.utils.areArrays = function (entities) {
    fluid.each(entities, function (entity) {
        var arrays = [], nonArrays = [];
        if (Array.isArray(entity)) {
            arrays.push(entity);
        }
        else {
            nonArrays.push(entity);
        }

        return {
            arrays: arrays,
            nonArrays: nonArrays
        };
    });
};
