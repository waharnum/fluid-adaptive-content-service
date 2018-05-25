'use strict';

var fluid = require('infusion');
var adaptiveContentServices = fluid.registerNamespace('adaptiveContentServices');

require('kettle');

fluid.defaults('adaptiveContentServices.Dictionary.serverConfig', {
  gradeNames: 'fluid.component',
  components: {
    server: {
      type: 'kettle.server',
      options: {
        port: 8081,
        components: {
          app: {
            type: 'kettle.app',
            options: {
              requestHandlers: {
                //Gives only the definition of the word
                mainDictionaryHandler: {
                  'type': 'adaptiveContentServices.handlers.dictionary.wiktionary',
                  'route': '/:version/dictionary/:language/definition/:word',
                  'method': 'get'
                }
              }
            }
          }
        }
      }
    }
  }
});

require('./handlers.js');

adaptiveContentServices.Dictionary.serverConfig();