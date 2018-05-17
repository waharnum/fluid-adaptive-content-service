'use strict';

var fluid = require('infusion');
var AdaptiveContentServices = fluid.registerNamespace('AdaptiveContentServices');

require('kettle');

fluid.defaults('AdaptiveContentServices.serverConfig', {
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
                mainHandler: {
                  'type': 'AdaptiveContentServices.serverConfig.mainHandler',
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

AdaptiveContentServices.serverConfig();