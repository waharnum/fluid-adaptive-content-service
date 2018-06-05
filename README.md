# fluid-adaptive-content-service
Repo for GSOC Project Described at https://wiki.fluidproject.org/display/fluid/Google+Summer+of+Code+2018+with+the+Fluid+Project#GoogleSummerofCode2018withtheFluidProject-Buildaserviceforadaptivecontentandlearningsupports

## Instructions to run the service locally
**Step 1 - Clone the Repository**\
**Step 2 - Install the required node modules**\
Run
```
npm install
```
**Step 3 - Start the service server**\
When at the root of the repository, run
```
npm start
```
When the server starts, it is ready to accept requests at the available endpoints.

Currently available endpoints - 
- `http://localhost:8081/v1/dictionary/{language_code}/definition/{word}`\
**Method**: `GET`\
**Language Code**: English (en), French (fr) and German (de)

- `http://localhost:8081/v1/dictionary/{language_code}/synonyms/{word}`\
**Method**: `GET`\
**Language Code**: IANA standards

- `http://localhost:8081/v1/dictionary/{language_code}/antonyms/{word}`\
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

(Wiktionary doesn't provide synonyms and antonyms)

Example endpoints:
- `http://localhost:8081/v1/dictionary/en/definition/horse`
- `http://localhost:8081/v1/dictionary/wiktionary/fr/definition/rien`
- `http://localhost:8081/v1/dictionary/oxford/en/definition/horse`

Tests for these endpoints lie in `share/dictionary/tests`\
To run them
```
node ./share/dictionary/tests/{testFolderName}/{testFileName}.js
```
when at the root of the repository.

Learn more about the service and the endpoints, in its documentation, which can be found [here](https://app.swaggerhub.com/apis/kunal4/fluid-adaptive-content-service/1.0.0).