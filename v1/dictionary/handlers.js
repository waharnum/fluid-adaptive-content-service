'use strict';

var fluid = require('infusion');
var AdaptiveContentServices = fluid.registerNamespace('AdaptiveContentServices');
var wd = require('word-definition');

require('kettle');


/* General function to get definition 
 * from all the different third-party dictionary services being used
 * Simply gives the complete response from the third party service 
 * Does not manipulate it in any way
 * The function returns a promise whose result contains the response
 * from the third-party service
 * Service codes -
 *  Wiktionary -> 'wiki'
 */
function definition(service, lang, word) {

  //Wiktionary Service
  if(service == 'wiki') {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function(data) {
      promise.resolve(data);
    });
    return promise;
  }
}

/* General function to catch the errors
 * From the third-party dictionary services
 * Service codes -
 *  Wiktionary -> 'wiki'
 */
function checkDictionaryErr(service, serviceResponse) {
  //Wiktionary Service
  if(service == 'wiki') {

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
}

//Main request handler - Gives only the definition of the word
fluid.defaults('AdaptiveContentServices.Dictionary.serverConfig.mainDictionaryHandler', {
  gradeNames: 'kettle.request.http',
  invokers: {
    handleRequest: 'AdaptiveContentServices.Dictionary.serverConfig.mainDictionaryRequestHandler'
  }
});

AdaptiveContentServices.Dictionary.serverConfig.mainDictionaryRequestHandler = function(request) {
  try {
    var version = request.req.params.version;
    var word = request.req.params.word;
    var lang = request.req.params.language;

    var serviceResponse, errorContent;

    definition('wiki', lang, word)
    .then(
      function(result) {
        serviceResponse = result;

        errorContent = checkDictionaryErr('wiki', serviceResponse);

        request.res.set({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });
    
        //Error Responses
        if(errorContent) {
          request.res.status(errorContent.statusCode)
          .send({
            version: 'v1',
            statusCode: errorContent.statusCode,
            responseMessage: errorContent.errorMessage,
            jsonResponse: {}
          })
        }
        //No error : Word found
        else {
          request.res.status(200)
          .send({
            version: 'v1',
            statusCode: 200,
            responseMessage: 'Dictionary Service: Word Found (Wiktionary)',
            jsonResponse: serviceResponse
          });
        }
      }
    )
  }
  //Error with the API code
  catch(error) {
    request.res.status(500)
    .send({
      version: 'v1',
      statusCode: 500,
      responseMessage: 'Dictionary Service: Internal Server Error (Wiktionary): '+error,
      jsonResponse: {}
    });
  }
}
