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
    });

    return {
        present: propertiesPresent,
        absent: propertiesAbsent
    };
};

//for a given array of variables, sort them on the basis of whether they arrays or not
adaptiveContentService.tests.utils.areArrays = function (entities) {
    var arrays = [], nonArrays = [];
    fluid.each(entities, function (entity) {
        if (fluid.isArrayable(entity.value)) {
            arrays.push(entity.name);
        }
        else {
            nonArrays.push(entity.name);
        }
    });

    return {
        arrays: arrays,
        nonArrays: nonArrays
    };
};

//for a given array of variables, sort them on the basis of whether they plain objects or not
adaptiveContentService.tests.utils.areObjects = function (entities) {
    var objects = [], nonObjects = [];
    fluid.each(entities, function (entity) {
        if (fluid.isPlainObject(entity.value)) {
            objects.push(entity.name);
        }
        else {
            nonObjects.push(entity.name);
        }
    });

    return {
        objects: objects,
        nonObjects: nonObjects
    };
};

adaptiveContentService.tests.utils.constructEntities = function (names, values) {
    // check if the parameters given are correct
    if (names.length === values.length) {
        var entities = [];
        fluid.each(values, function (entitiyValue, index) {
            entities.push({
                name: names[index],
                value: entitiyValue
            });
        });

        return entities;
    }
    else {
        jqunit.fail("\n\nError with the test code : The arrays - 'names' and 'entities' should have the same length\n");
    }
};
