"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        eslint: {
            all: ["./share/**/*.js", "./share/**/**/*.js", "./v1/**/*.js", "./v1/**/**/*.js", "*.js"]
        },
        jsonlint: {
            all: ["./v1/**/config/*.json", "*.json"]
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");

    grunt.registerTask("default", ["eslint", "jsonlint"]);
};
