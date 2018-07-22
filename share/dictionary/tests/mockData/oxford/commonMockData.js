"use strict";

var kettle = require("kettle");
require("dotenv").config();// npm package to get variables from '.env' file

module.exports = {
    word: {
        correct: "happy",
        wrong: "wrongWord"
    },
    lang: {
        correct: "en",
        wrong: "asd",
        invalid: "english" // greater than 3 letters
    },
    apiKeys: {
        correct: {
            "app_id": kettle.resolvers.env("OXFORD_APP_ID"),
            "app_key": kettle.resolvers.env("OXFORD_APP_KEY")
        },
        wrong: {
            "app_id": "randomstring",
            "app_key": "randomstring"
        }
    }
};
