'use strict';

var fluid = require('infusion');
var AdaptiveContentServices = fluid.registerNamespace('AdaptiveContentServices');

require('kettle');

fluid.defaults('AdaptiveContentServices.Dictionary.serverConfig', {
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
                  'type': 'AdaptiveContentServices.Dictionary.serverConfig.mainDictionaryHandler',
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

AdaptiveContentServices.Dictionary.serverConfig();