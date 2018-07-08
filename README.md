# fluid-adaptive-content-service
Repo for GSOC Project Described at https://wiki.fluidproject.org/display/fluid/Google+Summer+of+Code+2018+with+the+Fluid+Project#GoogleSummerofCode2018withtheFluidProject-Buildaserviceforadaptivecontentandlearningsupports

## Instructions to run the service locally
### Step 1 - Clone the Repository
### Step 2 - Install the required node modules
Run
```
npm install
```
### Step 3 - Setting API keys for services that require it
Currently, only *Oxford* is the service being used that requires API keys. You can create an account on [their site](https://developer.oxforddictionaries.com/) and acquire your free *API ID* and *API KEY* from there.
After acquiring the Id and Key, create a `.env` file looking like this
```
OXFORD_APP_ID=your_api_id_goes_here
OXFORD_APP_KEY=your_api_key_goes_here
```
### Step 4 - Start the service server
- **All Services together**
```
npm start
```
This will run all the endpoints, from all the services, at port 8080
- **Dictionary Service Server**
```
npm run dictionary
```
This will run all the dictionary service server, at port 8081
- **NLP Service Server**
```
npm run nlp
```
This will run all the nlp service server, at port 8082
- **Translation Service Server**
```
npm run translation
```
This will run all the translation service server, at port 8083

**Note** that all the above commands should be run at the root of the repository

When the server starts, it is ready to accept requests at the available endpoints.

## Available Endpoints
Currently available endpoints - 
### Dictionary Service
- `http://localhost:8081/v1/dictionary/{language_code}/definition/{word}`\
**Method**: `GET`\
**Language Code**: English (en), French (fr) and German (de)

- `http://localhost:8081/v1/dictionary/{language_code}/synonyms/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/antonyms/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/pronunciations/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards
- `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}/{lexicalCategory}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/wiktionary/{language_code}/definition/{word}` (Wiktionary-specific)\
**Method**: `GET`\
**Language Code**: English (en), French (fr) and German (de)

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/definition/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/synonyms/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/antonyms/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/pronunciations/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards
- `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}/{lexicalCategory}` (Oxford-specific)\
**Method**: `GET`\
**Language Code**: IANA standards

(Wiktionary only gives definition)

Example endpoints:
- `http://localhost:8081/v1/dictionary/en/definition/horse`
- `http://localhost:8081/v1/dictionary/wiktionary/fr/definition/rien`
- `http://localhost:8081/v1/dictionary/oxford/en/definition/horse`

### NLP Service
- `http://localhost:8082/v1/nlp/compromise/tags`\
**Method**: `POST`\
**Request Body Format**: `{ sentence: "{sentence_to_be_tagged}" }`

Example endpoints:
- `http://localhost:8082/v1/nlp/compromise/tags`\
**Body** `{ sentence: "Hello world! This is a test sentence" }`

### Translation Service
- `http://localhost:8083/v1/translation/yandex/{source_lang}-{target_lang}`\
**Method**: `POST`\
**Request Body Format**: `{ text: "text_to_be_translated"}`\
**Language Code**: ISO 639-1 (2-lettered language codes)

Example endpoints:
- `http://localhost:8083/v1/translation/yandex/en-de`\
**Body** `{ text: "This is the text to be translated" }`

## Running Tests

Tests for these endpoints lie in -
- `share/dictionary/tests/` - Tests for dictionary endpoints
- `share/nlp/tests/` - Tests for nlp endpoints
- `share/translation/tests/` - Tests for translation endpoints


There are 3 kinds of tests for each service -
- **Unit Tests** - Tests for individual functions
- **Integration Tests** - Testing the overall functioning of the endpoint (using mock test servers)
- **Contract Tests** - Testing if the external service provides data with the expected structure

There are several ways of running the tests - 
- Running all `Unit` and `Integration` tests of all services togther
```
npm test
```
- Running all `Contract` tests of all services together
```
npm run test-contract
```
- Running all `Unit` and `Integration` tests of a particular service
```
// for dictionary service
npm run test-dictionary

// for nlp service
npm run test-nlp

// for translation service
npm run test-translation
```
- Running all `Contract` tests of a particular service
```
// for dictionary service
npm run test-dictionary-contract

// for nlp service
npm run test-nlp-contract

// for translation service
npm run test-translation-contract
```
- To run a particular test
```
node /relative/path/to/the/test/file
```
**Note** that all the above commands for running tests should be run at the root of the repository

## Documentation
Learn more about the service and the endpoints, in its documentation, which can be found [here](https://app.swaggerhub.com/apis/kunal4/fluid-adaptive-content-service/1.0.0).