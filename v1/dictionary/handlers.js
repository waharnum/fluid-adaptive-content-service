'use strict';

var fluid = require('infusion');
var adaptiveContentServices = fluid.registerNamespace('adaptiveContentServices');
var wd = require('word-definition');

require('kettle');

/* Abstract grade for dictionary service endpoints
 * from which all other handler grades will extend
*/
fluid.defaults('adaptiveContentServices.handlers.dictionary', {
  gradeNames: 'kettle.request.http',
  invokers: {
    handleRequest: {
      func: '{that}.commonDictionaryDispatcher',
      args: ['{arguments}.0', '{that}.dictionaryHandlerImpl', '{that}']
    },
    commonDictionaryDispatcher: 'adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher',
    dictionaryHandlerImpl: 'fluid.notImplemented',
    definitionImpl: 'fluid.notImplemented',
    checkDictionaryErrorImpl: 'fluid.notImplemented'
  }
});

adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher = function(request, serviceSpecificImp, that) {
  var version = request.req.params.version;
  var word = request.req.params.word;
  var lang = request.req.params.language;

  serviceSpecificImp(request, version, word, lang, that);
}

//Specific grade for Wiktionary
fluid.defaults('adaptiveContentServices.handlers.dictionary.wiktionary', {
  gradeNames: 'adaptiveContentServices.handlers.dictionary',
  invokers: {
    dictionaryHandlerImpl: {
      funcName: 'adaptiveContentServices.handlers.dictionary.wiktionary.getDefinition',
      args: ['{arguments}.0', '{arguments}.1', '{arguments}.2', '{arguments}.3', '{that}']
    },
    definitionImpl: 'adaptiveContentServices.handlers.dictionary.wiktionary.definition',
    checkDictionaryErrorImpl: 'adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError'
  }
});

//Wiktionary-specific handler
adaptiveContentServices.handlers.dictionary.wiktionary.getDefinition = function(request, version, word, lang, that) {
  try {
    var serviceResponse, errorContent;

    that.definitionImpl(lang, word)
    .then(
      function(result) {
        serviceResponse = result;

        errorContent = that.checkDictionaryErrorImpl(serviceResponse);

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

/* Function to get definition from the wiktionary service
 */
adaptiveContentServices.handlers.dictionary.wiktionary.definition = function(lang, word) {
  var promise = fluid.promise();
  wd.getDef(word, lang, null, function(data) {
    promise.resolve(data);
  });
  return promise;
}

/* Function to catch the errors for wiktionary service
 */
adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError = function(serviceResponse) {

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