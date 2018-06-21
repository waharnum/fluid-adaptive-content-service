var nock = require("nock");
var correctWord = "bath",
    wrongWord = "wrongword",
    correctLang = "en",
    wrongLang = "wrong";

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

nock(urlBase)
.get("/entries/" + correctLang + "/" + correctWord)
.reply(
  200,
  {
    results: [
      {
        id: "bath",
        pronunciations: [
          {
            "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
            "dialects": [
                "British English"
            ],
            "phoneticNotation": "IPA",
            "phoneticSpelling": "bɑːθ"
          }
        ],
        lexicalEntries: [
          {
            pronunciations: [
              {
                "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                "dialects": [
                    "British English"
                ],
                "phoneticNotation": "IPA",
                "phoneticSpelling": "bɑːθ"
              }
            ],
            entries: [
              {
                pronunciations: [
                  {
                    "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                    "dialects": [
                        "British English"
                    ],
                    "phoneticNotation": "IPA",
                    "phoneticSpelling": "bɑːθ"
                  }
                ],
                senses: [
                  {
                    pronunciations: [
                      {
                        "audioFile": "http://audio.oxforddictionaries.com/en/mp3/bath_gb_1.mp3",
                        "dialects": [
                            "British English"
                        ],
                        "phoneticNotation": "IPA",
                        "phoneticSpelling": "bɑːθ"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
)
.get("/entries/" + correctLang + "/" + wrongWord)
.reply(
  404,
  "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>"
)
.get("/entries/" + wrongLang + "/" + correctWord)
.reply(
  404,
  "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>"
)