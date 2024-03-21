"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCommand = void 0;
var fs_1 = __importDefault(require("fs"));
var io_1 = require("../common/io");
var logging_1 = require("../common/logging");
/**
 * Clears saved data for any cards already sent for set with given setcode in given channel
 */
function clearCommand(channel, set) {
    var fileName = io_1.getFilename(set, channel.id);
    try {
        fs_1.default.writeFile(fileName, '[]', function (err) {
            if (err) {
                channel.send("Something went wrong with clearing file for set with code " + set + ".");
                logging_1.Log("Something went wrong with clearing file " + fileName + " for set with code " + set + ".");
                logging_1.Error(err.message);
                return;
            }
            logging_1.Log("Successfully cleared file " + fileName + ".");
        });
        channel.send("Successfully cleared file for set with code " + set + ".");
    }
    catch (error) {
        channel.send("Something went wrong with clearing file for set with code " + set + ".");
        logging_1.Log("Something went wrong with clearing file " + fileName + " for set with code " + set + ".");
        logging_1.Error(error);
    }
}
exports.clearCommand = clearCommand;
