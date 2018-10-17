'use strict';

const Alexa = require('ask-sdk');

const msg = {
    welcome: 'Welcome to Spell of the Day! You can say: "Word of the Day"'
    exit: 'Goodbye!',
    fallback: 'Hm... Can you say that again?',
    help: 'Help!',
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {

    }
};

const IntentHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AnswerIntent';
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        // const request = handlerInput.requestEnvelope.request;
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speech = msg.help;
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(speech)
            .getResponse();
    },
};

const FallbackHandler = {
    // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
    //              This handler will not be triggered except in those locales, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speech = msg.fallback;
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(speech)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        // const request = handlerInput.requestEnvelope.request;
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(msg.exit)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        // const request = handlerInput.requestEnvelope.request;
        const { request } = handlerInput.requestEnvelope;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        console.log(`Error stack: ${error.stack}`);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('ERROR_MESSAGE'))
            .reprompt(requestAttributes.t('ERROR_MESSAGE'))
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        GetNewFactHandler,
        HelpHandler,
        ExitHandler,
        FallbackHandler,
        SessionEndedRequestHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
