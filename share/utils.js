"use strict";

var fluid = require("infusion");

var ACS = fluid.registerNamespace("ACS");

//utility function for logging
ACS.log = function (message) {
    //Cyan colored highlight for the log message label
    var label = "\x1b[36mAdaptive Content Service : \x1b[0m";

    fluid.log(fluid.logLevel.IMPORTANT, label + message);
};
