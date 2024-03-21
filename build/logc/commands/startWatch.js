"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWatchCommand = void 0;
var models_1 = require("../../models/");
var commands_1 = require("../commands");
var logging_1 = require("../common/logging");
var io_1 = require("../common/io");
var spoilerWatches_1 = require("../common/spoilerWatches");
/**
 * Starts spoilerwatch for set with the given setcode in the given channel
 */
function startWatchCommand(channel, set) {
    //Add the combination to the watched sets and save this
    global.watchedSetcodes.push(new models_1.WatchedSetCode(set, channel.id));
    io_1.saveWatchedSets();
    logging_1.Log("Starting spoilerwatch for set " + set + ".");
    channel.send("Starting spoilerwatch for set " + set + ".");
    //Immediately look for new cards
    logging_1.Log("Start looking for new cards on " + Date.now());
    commands_1.getNewCardsCommand(channel, set);
    //Start the interval to look for new cards
    var interval = spoilerWatches_1.startSpoilerWatch(channel, set);
    global.savedIntervals.push(new models_1.SavedInterval(set, channel.id, interval));
}
exports.startWatchCommand = startWatchCommand;
