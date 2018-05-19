'use strict';

var fluid = require('infusion');
var kettle = require('kettle');
var jqunit = require('node-jqunit');

var AdaptiveContentService = fluid.registerNamespace('AdaptiveContentService');
fluid.registerNamespace('AdaptiveContentService.tests.dictionary');

fluid.logObjectRenderChars = 10000; // to ask

kettle.loadTestingSupport();

AdaptiveContentService.tests.dictionary = [{
  name: 'GET request for the definition-only dictionary endpoint',
  expect: 3,
  config: {
    configName: 'dictionaryServerConfig',
    configPath: './v1/dictionary/config/'
  },
  components: {
    correctWordTest: {
      type: 'kettle.test.request.http',
      options: {
        path: '/v1/dictionary/en/definition/word',
        method: 'get'
      }
    },
    wrongWordTest: {
      type: 'kettle.test.request.http',
      options: {
        path: '/v1/dictionary/en/definition/wrongword',
        method: 'get'
      }
    },
    wrongLangTest: {
      type: 'kettle.test.request.http',
      options: {
        path: '/v1/dictionary/wrong/definition/word',
        method: 'get'
      }
    }
  },
  sequence: [{
    func: '{correctWordTest}.send'
  },
  {
    event: '{correctWordTest}.events.onComplete',
    listener: 'AdaptiveContentService.tests.dictionary.correctWordHandler'
  },
  {
    func: '{wrongWordTest}.send'
  },
  {
    event: '{wrongWordTest}.events.onComplete',
    listener: 'AdaptiveContentService.tests.dictionary.wrongWordHandler'
  },
  {
    func: '{wrongLangTest}.send'
  },
  {
    event: '{wrongLangTest}.events.onComplete',
    listener: 'AdaptiveContentService.tests.dictionary.wrongLangHandler'
  }
  ]
}];

//Test for the correct word
AdaptiveContentService.tests.dictionary.correctWordHandler = function(data, that) {  
  jqunit.assertEquals('Dictionary Tests : Definition Only test for correct word successful', 200, that.nativeResponse.statusCode);
}

//Test for the wrong word
AdaptiveContentService.tests.dictionary.wrongWordHandler = function(data, that) {  
  jqunit.assertEquals('Dictionary Tests : Definition Only test for wrong word successful', 404, that.nativeResponse.statusCode);
}

//Test for the unsupported language
AdaptiveContentService.tests.dictionary.wrongLangHandler = function(data, that) {  
  jqunit.assertEquals('Dictionary Tests : Definition Only test for unsupported language successful', 400, that.nativeResponse.statusCode);
}

kettle.test.bootstrapServer(AdaptiveContentService.tests.dictionary);