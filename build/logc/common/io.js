"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSavedCards = exports.getSavedCards = exports.writePrefix = exports.readPrefix = exports.readWatchedSets = exports.saveWatchedSets = exports.getFilename = void 0;
var fs_1 = __importDefault(require("fs"));
var constants_1 = __importDefault(require("../constants"));
var logging_1 = require("./logging");
var spoilerWatches_1 = require("./spoilerWatches");
/**
 * Returns the data filename for the given set and channelID
 */
function getFilename(set, channelID) {
    return "./data/" + channelID + "-" + set + "-data.json";
}
exports.getFilename = getFilename;
/**
 * Saves the array of watched sets and channel IDs to the data file
 */
function saveWatchedSets() {
    fs_1.default.writeFile(constants_1.default.WATCHEDSETCODESPATH, JSON.stringify(global.watchedSetcodes), function (err) {
        if (err) {
            logging_1.Log("Something went wrong with writing to watchedsetcodes.json");
            logging_1.Error(err.message);
            return;
        }
        logging_1.Log("Successfully written to file " + constants_1.default.WATCHEDSETCODESPATH + ".");
    });
}
exports.saveWatchedSets = saveWatchedSets;
/**
 * Reads the array of watched sets and channel IDs from the data file
 */
function readWatchedSets() {
    if (!fs_1.default.existsSync(constants_1.default.DATADIRECTORY)) {
        fs_1.default.mkdirSync(constants_1.default.DATADIRECTORY);
    }
    if (!fs_1.default.existsSync(constants_1.default.WATCHEDSETCODESPATH)) {
        fs_1.default.writeFile(constants_1.default.WATCHEDSETCODESPATH, "[]", function (err) {
            if (err) {
                logging_1.Log("Something went wrong with creating new empty watchedsetcodes.json");
                logging_1.Error(err.message);
            }
        });
    }
    fs_1.default.readFile(constants_1.default.WATCHEDSETCODESPATH, function (err, buf) {
        if (err) {
            logging_1.Log("Something went wrong with reading watchedsetcodes.json");
            logging_1.Error(err.message);
        }
        global.watchedSetcodes = JSON.parse(buf.toString());
        logging_1.Log("Successfully read file " + constants_1.default.WATCHEDSETCODESPATH + ".");
        spoilerWatches_1.startSpoilerWatches();
    });
    return;
}
exports.readWatchedSets = readWatchedSets;
/**
 * Reads preferred prefix from the settings
 * @param {*} defaultPrefix The default prefix to save if no settings file has been made yet
 */
function readPrefix(defaultPrefix) {
    var newPrefix = defaultPrefix;
    if (!fs_1.default.existsSync(constants_1.default.DATADIRECTORY)) {
        fs_1.default.mkdirSync(constants_1.default.DATADIRECTORY);
    }
    if (!fs_1.default.existsSync(constants_1.default.SETTINGSPATH)) {
        fs_1.default.writeFile(constants_1.default.SETTINGSPATH, '{"prefix":"' + defaultPrefix + '"}', function (err) {
            if (err) {
                logging_1.Log("Something went wrong with creating new default settings file");
                logging_1.Error(err.message);
            }
        });
    }
    else {
        fs_1.default.readFile(constants_1.default.SETTINGSPATH, function (err, buf) {
            if (err) {
                logging_1.Log("Something went wrong with reading settings.json");
                logging_1.Error(err.message);
            }
            var settings = JSON.parse(buf.toString());
            logging_1.Log("Successfully read file " + constants_1.default.SETTINGSPATH + ".");
            newPrefix = settings.prefix;
        });
    }
    return newPrefix;
}
exports.readPrefix = readPrefix;
/**
 * Overwrites the current prefix in the settings data file with the given new prefix
 */
function writePrefix(newPrefix) {
    if (!fs_1.default.existsSync(constants_1.default.DATADIRECTORY)) {
        fs_1.default.mkdirSync(constants_1.default.DATADIRECTORY);
    }
    if (!fs_1.default.existsSync(constants_1.default.SETTINGSPATH)) {
        fs_1.default.writeFile(constants_1.default.SETTINGSPATH, '{"prefix":"' + newPrefix + '"}', function (err) {
            if (err) {
                logging_1.Log("Something went wrong with creating new settings file");
                logging_1.Error(err.message);
            }
        });
    }
    else {
        fs_1.default.readFile(constants_1.default.SETTINGSPATH, function (err, buf) {
            if (err) {
                logging_1.Log("Something went wrong with reading settings.json");
                logging_1.Error(err.message);
            }
            var settings = JSON.parse(buf.toString());
            settings.prefix = newPrefix;
            fs_1.default.writeFile(constants_1.default.SETTINGSPATH, JSON.stringify(settings), function (err) {
                if (err) {
                    logging_1.Log("Something went wrong with updating prefix in the settings file");
                    logging_1.Error(err.message);
                }
            });
            logging_1.Log("Successfully updated the prefix in the settings file.");
        });
    }
}
exports.writePrefix = writePrefix;
/**
 * Reads saved card data for given setcode and channelID combination from file and returns the list of saved card ids
 */
function getSavedCards(setcode, channelID) {
    return new Promise(function (resolve, reject) {
        var savedCardlist = new Array();
        var filename = getFilename(setcode, channelID);
        fs_1.default.exists(filename, function (exists) {
            if (!exists) {
                // If data file doesn't exist yet, make an empty one
                fs_1.default.writeFile(filename, "[]", function (err) {
                    if (err) {
                        logging_1.Log("Something went wrong while writing new data file " + filename + ".");
                        logging_1.Error(err.message);
                        reject();
                    }
                    else {
                        logging_1.Log("Successfully written to file " + filename + ".");
                        resolve([]);
                    }
                });
            }
            else {
                // If data file does exist, try to read it
                try {
                    fs_1.default.readFile(filename, function (err, buf) {
                        if (err) {
                            logging_1.Log("Something went wrong while reading existing data file " + filename + ".");
                            logging_1.Error(err.message);
                            reject();
                        }
                        else {
                            logging_1.Log("Successfully read file " + filename + ".");
                            savedCardlist = JSON.parse(buf.toString());
                            resolve(savedCardlist);
                        }
                    });
                }
                catch (error) {
                    logging_1.Log("Something went wrong while parsing data from existing data file " + filename + ".");
                    logging_1.Error(error);
                    reject();
                }
            }
        });
    });
}
exports.getSavedCards = getSavedCards;
/**
 * Saves saved card data for given setcode and channelID combination to file, overwriting current file
 */
function setSavedCards(setcode, channelID, newSavedCardIDs) {
    var filename = getFilename(setcode, channelID);
    var savedCardListJSON = JSON.stringify(newSavedCardIDs);
    fs_1.default.writeFile(filename, savedCardListJSON, function (err) {
        if (err) {
            logging_1.Log("Something went wrong while writing to file " + filename + ".");
            logging_1.Error(err.message);
        }
        else {
            logging_1.Log("Succesfully written to file " + filename + ".");
        }
    });
}
exports.setSavedCards = setSavedCards;
