// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Variable defining number of events to be read at one time
 */
var paginationSize = 3;

/**
 * Variable defining the length of the delimiter between events
 */
var delimiterSize = 2;

/**
 * TrumpTweetsSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var TrumpTweetsSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TrumpTweetsSkill.prototype = Object.create(AlexaSkill.prototype);
TrumpTweetsSkill.prototype.constructor = TrumpTweetsSkill;

TrumpTweetsSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("TrumpTweetsSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

TrumpTweetsSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("TrumpTweetsSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

TrumpTweetsSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

TrumpTweetsSkill.prototype.intentHandlers = {

    GetFirstEventIntent: function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
    },

    GetNextEventIntent: function (intent, session, response) {
        handleNextEventRequest(intent, session, response);
    },

    HelpIntent: function (intent, session, response) {
        var speechOutput = "Go ahead try me.";
        response.ask(speechOutput);
    },

    FinishIntent: function (intent, session, response) {
        var speechOutput = "Have a tremendous day!";
        response.tell(speechOutput);
    }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "This Day in History";
    var repromptText = "With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?";
    var speechOutput = "History buff. What day do you want events for?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

    response.ask(speechOutput);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleFirstEventRequest(intent, session, response) {
    var sessionAttributes = {};
    // Read the first 3 events, then set the count to 3
    sessionAttributes.index = paginationSize;
    var tweetData = "What a fantastic day here in Mar a Lago.";
    response.tell(tweetData);
 }

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleNextEventRequest(intent, session, response) {
    var cardTitle = "More events on this day in history";
    var sessionAttributes = session.attributes;
    var result = sessionAttributes.text;
    var speechText = "";
    var repromptText = "Do you want to know more about what happened on this date?"
    if (!result) {
        speechText = "With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?";
    } else if (sessionAttributes.index >= result.length) {
        speechText = "There are no more events for this date. Try another date by saying, get events for august thirtieth.";
    } else {
        for (i = 0; i < paginationSize; i++) {
            if (sessionAttributes.index>= result.length) {
                break;
            }
            speechText = speechText + result[sessionAttributes.index] + " ";
            sessionAttributes.index++;
        }
        if (sessionAttributes.index < result.length) {
            speechText = speechText + " Wanna go deeper in history?";
        }
    }
    response.askWithCard(speechText, repromptText, cardTitle, speechText);
}


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new TrumpTweetsSkill();
    skill.execute(event, context);
};

