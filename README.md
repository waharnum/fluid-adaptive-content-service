# fluid-adaptive-content-service
Repo for GSOC Project Described at https://wiki.fluidproject.org/display/fluid/Google+Summer+of+Code+2018+with+the+Fluid+Project#GoogleSummerofCode2018withtheFluidProject-Buildaserviceforadaptivecontentandlearningsupports

## Instructions to run the service locally
**Step 1 - Clone the Repository**\
**Step 2 - Install the required node modules**\
Run
```
npm install
```
**Step 3 - Start the service server**
When at the root of the repository, run
```
npm start
```
When the server starts, it is ready to accept requests at the available endpoints

Currently, there is only 1 available endpoint. It can be tested by sending a `GET` request at `http://localhost:8081/v1/dictionary/{language_code}/definition/{word}` which gives the definition of the word and its category.\
Currently, this supports only three languages - English (en), French (fr) and German (de).\
For example, 
- `http://localhost:8081/v1/dictionary/en/definition/horse`
- `http://localhost:8081/v1/dictionary/fr/definition/rien`

To run tests for this endpoint, do
```
npm test
```
at the root of the repository.

Documentation for the service can be found [here](https://app.swaggerhub.com/apis/kunal4/fluid-adaptive-content-service/1.0.0).