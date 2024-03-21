"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCardsCommand = void 0;
var constants_1 = __importDefault(require("../constants"));
var logging_js_1 = require("../common/logging.js");
var card_helper_1 = require("../common/card-helper");
var scryfall_1 = require("../common/scryfall");
/**
 * Finds all cards in the given set that and post them to the given channel
 * @param {*} ignoreBasics if true, will not post the standard basic lands (plains, island, swamp, mountain, forest)
 */
function getAllCardsCommand(channel, set, ignoreBasics) {
    if (ignoreBasics === void 0) { ignoreBasics = true; }
    var message = "Trying to get cards from set with code " + set;
    if (ignoreBasics != false) {
        message += ' (excluding basic lands)';
    }
    channel.send(message + "...");
    scryfall_1.scryfallGetSet(set, ignoreBasics, _getSetMessages).then(function (messages) {
        logging_js_1.Log("Sending " + messages.length + " cards to channel with id " + channel.id);
        var interval = setInterval(function (messages) {
            if (messages.length <= 0) {
                logging_js_1.Log("Done with sending cards to channel with id " + channel.id);
                clearInterval(interval);
            }
            else {
                var message_1 = messages.pop();
                channel.send(message_1);
            }
        }, constants_1.default.MESSAGEINTERVAL, messages);
    }).catch(function (err) {
        channel.send(err);
    });
}
exports.getAllCardsCommand = getAllCardsCommand;
function _getSetMessages(cards) {
    var messages = new Array();
    cards.forEach(function (card) {
        var message = card_helper_1.generateCardMessage(card);
        messages.push(message);
    });
    return Promise.resolve(messages);
}
