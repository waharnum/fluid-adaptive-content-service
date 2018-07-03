"use strict";

module.exports = function (correctWord, frequency, lexicalCategory) {
    return {
        correctWord:
        {
          result: {
              frequency: frequency,
              lemma: correctWord,
              lexicalCategory: lexicalCategory
          }
        },
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in zu, ro, ta, sw, de, tn, lv, id, ur, en, nso, ms, gu, pt, hi, es</p>"
    };
};
