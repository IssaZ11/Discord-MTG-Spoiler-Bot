"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSpoilerWatches = exports.startSpoilerWatch = void 0;
var constants_1 = __importDefault(require("../constants"));
var logging_1 = require("./logging");
var commands_1 = require("../commands");
var models_1 = require("../../models");
/**
 * Start the interval to look for new cards for the given set and channelID
 */
function startSpoilerWatch(channel, set) {
    return setInterval(function (set) {
        logging_1.Log("Start looking for new cards in set " + set + " for channel " + channel.id);
        commands_1.getNewCardsCommand(channel, set);
    }, constants_1.default.SPOILERWATCHINTERVALTIME, set);
}
exports.startSpoilerWatch = startSpoilerWatch;
/**
 * Starts spoiler watches for all saved watched setcodes
 */
function startSpoilerWatches() {
    logging_1.Log("Watched sets: " + JSON.stringify(global.watchedSetcodes));
    for (var i = 0; i < global.watchedSetcodes.length; i++) {
        var watchedSet = global.watchedSetcodes[i];
        logging_1.Log("Watched set: " + JSON.stringify(watchedSet));
        logging_1.Log("Start looking for new cards in set " + watchedSet.setCode + " for channel " + watchedSet.channelID);
        var channel = global.bot.channels.cache.get(watchedSet.channelID);
        if (channel) {
            var interval = startSpoilerWatch(channel, watchedSet.setCode);
            global.savedIntervals.push(new models_1.SavedInterval(watchedSet.setCode, channel.id, interval));
            commands_1.getNewCardsCommand(channel, watchedSet.setCode);
        }
        else {
            logging_1.Error('Something went wrong getting channel from saved watched setcodes file');
        }
    }
    return;
}
exports.startSpoilerWatches = startSpoilerWatches;
