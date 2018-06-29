"use strict";

var fluid = require("infusion");
var jqunit = require("node-jqunit");

var nlp = require("compromise");//npm package that provides NLP services

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.contractTests.tags");

adaptiveContentService.tests.nlp.compromise.contractTests.tags = function (sentence) {
    var sentenceData = nlp(sentence);
    var tagsData = sentenceData.out("tags");

    //Check that the data provided by the 'compromise' package matches the expected structure

    var response = tagsData; //main response from the service

    //for entities expected to be objects
    var objectEntityNames = ["responseObject"];
    var objectEntityValues = [response[0]];

    var testObjectEntities = adaptiveContentService.tests.utils.constructEntities(objectEntityNames, objectEntityValues);

    var sortedObjectsEntities = adaptiveContentService.tests.utils.areObjects(testObjectEntities);

    //check if all the entities required to be objects are objects
    if (sortedObjectsEntities.nonObjects.length > 0) {
        jqunit.fail("\n\nContract Test : Failed (Compromise Service) : " + sortedObjectsEntities.nonObjects + " was/were expected to be 'plain objects' but were not\n");
    };


    //for properties expected in the response object
    var responseObjectRequiredProperties = ["text", "tags"];

    var responseObjectSortedProperties = adaptiveContentService.tests.utils.objectHasProperties(response[0], responseObjectRequiredProperties);

    //check if the required properties are absent in response object
    if (responseObjectSortedProperties.absent.length > 0) {
        jqunit.fail("\n\nContract Test : Failed (Compromise Service) : " + responseObjectSortedProperties.absent + " was/were expected to be properties of the response object but were not found\n");
    }


    //for entities expected to be arrays
    var arrayEntityNames = ["response", "tags"];
    var arrayEntityValues = [response, response[0].tags];

    var testArrayEntities = adaptiveContentService.tests.utils.constructEntities(arrayEntityNames, arrayEntityValues);

    var sortedArrayEntities = adaptiveContentService.tests.utils.areArrays(testArrayEntities);

    //check if all the entities required to be arrays are arrays
    if (sortedArrayEntities.nonArrays.length > 0) {
        jqunit.fail("\n\nContract Test : Failed (Compromise Service) : " + sortedArrayEntities.nonArrays + " was/were expected to be 'arrays' but were not\n");
    };

    // jqunit.assert("Contract Test : For Sentence Tagging (Compromise Service) : Successful");
};

var testSentence = "Hello world";

jqunit.test(
    "Contract Test : For Sentence Tagging (Compromise Service)",
    function () {
        adaptiveContentService.tests.nlp.compromise.contractTests.tags(testSentence);
    }
);
