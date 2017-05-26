"use strict";

//setup / import libraries
const ApiAiAssistant = require("actions-on-google").ApiAiAssistant;
const express = require("express");
const bodyParser = require("body-parser");
const httpRequest = require("request-promise");  
require("string_score");
const utilities = require("./utilities.js"); //utility functions
const app = express();
app.set("port", (process.env.PORT || 8080));
app.use(bodyParser.json({type: "application/json"}));

var io = require('socket.io-client')

app.post("/", function (request, response) {

  const assistant = new ApiAiAssistant({request: request, response: response});

  function replyToUser(request, response, assistant, speech) {
      if(request.body.originalRequest && request.body.originalRequest.source == "google") { //for google assistant
          assistant.ask(speech + ". What else can I help you with?"); //assistant.tell will end the conversation
      }
      else { //for slack
          return response.json({
                  speech: speech,
                  displayText: speech,
                  source: "summit_bot"
              });
      }
  }

  const EUGENE_ACTION = "eugene";

  function handleEugene(assistant) {
    //const EUGENE_ARG = "eugeneCall";
    //const eugeneCall = assistant.getArgument(EUGENE_ARG);

    //const eugeneUrl = "http://api.reimaginebanking.com/customers/5926f1fbceb8abe24250ddc3/accounts?key=71ad9748b099a0d947b85535d9954611"
    const eugeneUrl = "http://29488423.ngrok.io/payments"
    httpRequest({  
      method: "GET",
      uri: eugeneUrl,
      json: true
    }).then(function (json) {
      var sum = 0;
      for(var i=0; i < json.length; i++){
      	sum += json[i].value
      }
      replyToUser(request, response, assistant, "You have " + sum + " dollars");
    })
    .catch(function (err) {
      console.log("Error:" + err);
      const speech = "idk";
      replyToUser(request, response, assistant, speech);
    });
  }

  const EUGENE_ACTION2 = "eugene2";

  function handleEugene2(assistant) {
    //const EUGENE_ARG = "eugeneCall";
    //const eugeneCall = assistant.getArgument(EUGENE_ARG);

    //const eugeneUrl = "http://api.reimaginebanking.com/customers/5926f1fbceb8abe24250ddc3/accounts?key=71ad9748b099a0d947b85535d9954611"
    const eugeneUrl = "http://29488423.ngrok.io/payments"
    httpRequest({  
      method: "GET",
      uri: eugeneUrl,
      json: true
    }).then(function (json) {
      var sum = json[0].value;
      var amount = json[0].message;
      replyToUser(request, response, assistant, "You made " + sum + " by " + amount);
    })
    .catch(function (err) {
      console.log("Error:" + err);
      const speech = "idk";
      replyToUser(request, response, assistant, speech);
    });
  }
 
  //create a map of potential actions that a user can trigger
  const actionMap = new Map();

  actionMap.set(EUGENE_ACTION, handleEugene);
  actionMap.set(EUGENE_ACTION2, handleEugene2);
  //register the action map with the assistant
  assistant.handleRequest(actionMap);
});

// Start the server on your local machine
const server = app.listen(app.get("port"), function () {
  console.log("App listening on port %s", server.address().port);
  console.log("Press Ctrl+C to quit.");
});