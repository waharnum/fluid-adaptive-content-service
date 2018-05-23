'use strict';

var fluid = require('infusion');
var AdaptiveContentServices = fluid.registerNamespace('AdaptiveContentServices');
var wd = require('word-definition');

require('kettle');

/* General grade for dictionary service endpoints
 * from which all other handler grades will extend
*/
fluid.defaults('AdaptiveContentServices.handlers.dictionary', {
  gradeNames: 'kettle.request.http',
  invokers: {
    handleRequest: 'fluid.notImplemented',
    wikiDefinition: {
      funcName: 'AdaptiveContentServices.handlers.dictionary.wikiDefinition',
      args: ['{arguments}.0', '{arguments}.1']
    },
    checkWikiErr: {
      funcName: 'AdaptiveContentServices.handlers.dictionary.checkWikiErr',
      args: ['{arguments}.0']
    }
  }
})

/* Function to get definition from the wiktionary service
 */
AdaptiveContentServices.handlers.dictionary.wikiDefinition = function(lang, word) {
  var promise = fluid.promise();
  wd.getDef(word, lang, null, function(data) {
    promise.resolve(data);
  });
  return promise;
}

/* Function to catch the errors for wiktionary service
 */
AdaptiveContentServices.handlers.dictionary.checkWikiErr = function(serviceResponse) {

    //Check if there is an error
    if(serviceResponse.err) {

      //Word not found
      if(serviceResponse.err == 'not found') {
        return {
          statusCode: 404,
          errorMessage: 'Dictionary Service: Word not found (Wiktionary)'
        }
      }

      //Language unsupported by the third-party service
      else if(serviceResponse.err == 'unsupported language') {
        return {
          statusCode: 400,
          errorMessage: 'Dictionary Service: Unsupported Language (Wiktionary)'
        }
      }

      //Default return object when error hasn't been handled yet
      else return {
        statusCode: 500,
        errorMessage: 'Dictionary Service: The error hasn\'t been handled yet (Wiktionary)'
      };
    }

    //Return false if no error found
    else return;
}

//request handler for wiktionary
fluid.defaults('AdaptiveContentServices.handlers.dictionary.wiktionary', {
  gradeNames: 'AdaptiveContentServices.handlers.dictionary',
  invokers: {
    handleRequest: {
      funcName: 'AdaptiveContentServices.handlers.dictionary.wiktionary.getDefinition',
      args: ['{arguments}.0', '{that}']
    }
  }
});

AdaptiveContentServices.handlers.dictionary.wiktionary.getDefinition = function(request, that) {
  try {
    var version = request.req.params.version;
    var word = request.req.params.word;
    var lang = request.req.params.language;

    var serviceResponse, errorContent;

    that.wikiDefinition(lang, word)
    .then(
      function(result) {
        serviceResponse = result;

        errorContent = that.checkWikiErr(serviceResponse);

        request.res.set({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });
    
        //Error Responses
        if(errorContent) {
          request.events.onError.fire({
            version: 'v1',
            statusCode: errorContent.statusCode,
            message: errorContent.errorMessage,
            jsonResponse: {}
          });
        }
        //No error : Word found
        else {
          request.events.onSuccess.fire({
            version: 'v1',
            message: 'Dictionary Service: Word Found (Wiktionary)',
            jsonResponse: serviceResponse
          });
        }
      }
    )
  }
  //Error with the API code
  catch(error) {
    request.events.onError.fire({
      version: 'v1',
      statusCode: 500,
      message: 'Dictionary Service: Internal Server Error (Wiktionary): '+error,
      jsonResponse: {}
    });
  }
}