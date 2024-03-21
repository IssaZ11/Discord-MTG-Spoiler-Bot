"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopWatchCommand = void 0;
var logging_1 = require("../common/logging");
var io_1 = require("../common/io");
/**
 * Stops any current spoilerwatch for set with the given setcode in the given channel
 */
function stopWatchCommand(channel, set) {
    logging_1.Log("Checking spoilerwatch for set " + set + ".");
    logging_1.Log("Checking if set matches with " + set + " and channel matches with " + channel.id);
    // Check if set is watched in the current channel
    if (global.watchedSetcodes &&
        global.watchedSetcodes.filter(function (watchedset) {
            watchedset.setCode == set && watchedset.channelID == channel.id;
        })) {
        logging_1.Log("Stopping spoilerwatch for set " + set + ".");
        channel.send("Stopping spoilerwatch for set " + set + ".");
        // Find the timeout for this set and channel
        global.savedIntervals.find(function (o, i) {
            if (o.setcode == set && o.channel == channel.id) {
                // Stop the interval that checks for spoilers
                clearInterval(o.interval);
                global.savedIntervals.splice(i, 1);
                return true;
            }
            return false;
        });
        // Remove the set and channel combination from the watchedSetcodes and save it
        global.watchedSetcodes = global.watchedSetcodes.filter(function (watchedset) {
            watchedset.setCode != set || watchedset.channelID != channel.id;
        });
        io_1.saveWatchedSets();
    }
    else {
        channel.send("No spoilerwatch for set " + set + " is running in this channel.");
    }
}
exports.stopWatchCommand = stopWatchCommand;
