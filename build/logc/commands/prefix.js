"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixCommand = void 0;
var io_1 = require("../common/io");
/**
 * Changes the prefix for the bot to the given new prefix
 */
function prefixCommand(channel, newPrefix) {
    var oldPrefix = global.prefix;
    io_1.writePrefix(newPrefix);
    global.prefix = newPrefix;
    channel.send("Changed prefix from '" + oldPrefix + "' to '" + newPrefix + "'.");
}
exports.prefixCommand = prefixCommand;
