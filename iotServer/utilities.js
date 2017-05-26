const jsonData = require("./data.json"); //read in summit data

module.exports = {
     findPersonData: function(firstName,lastName){
        let nameQuery = firstName;
        if(lastName){
            nameQuery += " " + lastName;
        }

        let topScore = 0.0;
        let personIndexToReturn = 0;
        for(let i = 0; i < jsonData.length; i++) {
            const nameToCompare = (jsonData[i].firstName + " " + (lastName ? jsonData[i].lastName : "")).trim();
            const score = nameToCompare.score(nameQuery);
            if(score > topScore){
                personIndexToReturn = i;
                topScore = score;
            }
        }

        if(topScore > 0.4){
            return jsonData[personIndexToReturn];
        }
        else{
            return null;
        }
    },

    replyToUser: function(request, response, assistant, speech) {
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
    },

    speechForWeatherAPIJson: function(dayOfWeekRequested, json) {
        const forecastDays = json.forecast.txt_forecast.forecastday;
        for(let i = 0; i < forecastDays.length; i++) {
            const dayOfWeek = forecastDays[i].title.toLowerCase();
            if(dayOfWeek == dayOfWeekRequested) {
                return "Here is the forecast for " + dayOfWeekRequested + ": " + forecastDays[i].fcttext;
            }
        }

        return "I can't find the forecast for " + dayOfWeekRequested;
    },

    speechForMetroAPIJson: function(lineColor, lineDirection, json) {
        const endOfOrangeLineEastCode = "D13"; //New Carrollton
        const endOfOrangeLineWestCode = "K08"; //Dunn Loring-Merrifield
        const endOfSilverLineEastCode = "G05"; //Largo Town Center
        const endOfSilverLineWestCode = "N06"; //Wiehle-Reston East

        const trains = json.Trains;
        let matchingTrain = null;
        for(let i = 0; i < trains.length; i++) {
            const train = trains[i];
            if(train.Line == "OR" && lineColor == "orange") {
                if(lineDirection == "east" && train.DestinationCode == endOfOrangeLineEastCode) {
                    matchingTrain = train;
                    break;
                }
                else if(lineDirection == "west" && train.DestinationCode == endOfOrangeLineWestCode) {
                    matchingTrain = train;
                    break;
                }
            }
            else if(train.Line == "SV" && lineColor == "silver") {
                if(lineDirection == "east" && train.DestinationCode == endOfSilverLineEastCode) {
                    matchingTrain = train;
                    break;
                }
                else if(lineDirection == "west" && train.DestinationCode == endOfSilverLineWestCode) {
                    matchingTrain = train;
                    break;
                }
            }
        }

        if(matchingTrain) {
            return "The next " + lineColor + " train heading " + lineDirection + " arrives in " + matchingTrain.Min + " minutes";
        }
        else {
            return "I couldn't find the next " + lineColor + " train heading " + lineDirection;
        }
    }
}