"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardCommand = void 0;
var card_helper_js_1 = require("../common/card-helper.js");
var scryfall_js_1 = require("../common/scryfall.js");
/**
 * Tries to find card with the given name and post it to the given channel
 * Uses Scryfall fuzzy search
 */
function getCardCommand(channel, name) {
    scryfall_js_1.scryfallGetCard(name, _getCardMessage).then(function (message) {
        channel.send(message);
    }).catch(function (err) {
        channel.send(err);
    });
}
exports.getCardCommand = getCardCommand;
function _getCardMessage(card, attemptedName) {
    if (card.object === 'card') {
        var message = card_helper_js_1.generateCardMessage(card);
        return Promise.resolve(message);
    }
    else {
        if (card.object == 'error') {
            if (card.type == 'ambiguous') {
                return Promise.reject("Found multiple cards with name like " + attemptedName + ". Please try to make a more specific query by adding more words.");
            }
            else {
                return Promise.reject("Did not find any card with name like " + attemptedName + ".");
            }
        }
    }
    return Promise.reject('Something went wrong, please try again');
}
