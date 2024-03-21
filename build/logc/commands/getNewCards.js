"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewCardsCommand = void 0;
var constants_1 = __importDefault(require("../constants"));
var logging_1 = require("../common/logging");
var io_1 = require("../common/io");
var card_helper_1 = require("../common/card-helper");
var scryfall_1 = require("../common/scryfall");
/**
 * Finds all new cards in the given set that haven't been posted to the given channel yet and posts them there
 * @param {boolean} verbose If true, will send messages to the channel if no cards are found
 * @param {boolean} ignoreBasics If true, the standard basic lands will not be sent (plains, island, swamp, mountain, forest)
 */
function getNewCardsCommand(channel, set, verbose, ignoreBasics) {
    if (verbose === void 0) { verbose = false; }
    if (ignoreBasics === void 0) { ignoreBasics = true; }
    if (verbose) {
        var message = "Trying to get newly spoiled cards from set with code " + set;
        if (ignoreBasics != false) {
            message += " (excluding basic lands)";
        }
        channel.send(message + "...");
    }
    var args = new GetNewSetArgs(set, channel.id, verbose);
    scryfall_1.scryfallGetSet(set, ignoreBasics, _getNewSetMessages, args).then(function (messages) {
        logging_1.Log("Sending " + messages.length + " cards to channel with id " + channel.id);
        var interval = setInterval(function (messages) {
            if (messages.length <= 0) {
                logging_1.Log("Done with sending cards to channel with id " + channel.id);
                clearInterval(interval);
            }
            else {
                var message = messages.pop();
                channel.send(message);
            }
        }, constants_1.default.MESSAGEINTERVAL, messages);
    }).catch(function (err) {
        channel.send(err);
    });
}
exports.getNewCardsCommand = getNewCardsCommand;
function _getNewSetMessages(cards, args) {
    return __awaiter(this, void 0, void 0, function () {
        var getNewSetArgs;
        return __generator(this, function (_a) {
            getNewSetArgs = args;
            if (!getNewSetArgs) {
                console.log(getNewSetArgs);
                logging_1.Error('YOU HECKED UP');
                return [2 /*return*/, ['YOU HECKED UP']];
            }
            // Read which cards are already saved
            return [2 /*return*/, io_1.getSavedCards(getNewSetArgs.set, getNewSetArgs.channelID).then(function (savedCardlist) {
                    // For every card: check if it's already saved, otherwise at it to the new list
                    var newCardlist = new Array();
                    cards.forEach(function (card) {
                        var cardId = card.oracle_id;
                        if (!savedCardlist.some(function (c) { return c == cardId; })) {
                            newCardlist.push(card);
                            savedCardlist.push(cardId);
                        }
                    });
                    // If new list is empty, no new cards were found
                    if (newCardlist.length <= 0) {
                        logging_1.Log("No new cards were found with set code " + getNewSetArgs.set);
                        if (getNewSetArgs.verbose) {
                            return Promise.reject(["No new cards were found with set code " + getNewSetArgs.set + "."]);
                        }
                        else {
                            return [];
                        }
                    }
                    // If new list wasn't empty, send one of the new cards to the channel every second
                    logging_1.Log(newCardlist.length + " new cards were found with set code " + getNewSetArgs.set);
                    // Save the updated list of saved cards to the datafile
                    try {
                        io_1.setSavedCards(getNewSetArgs.set, getNewSetArgs.channelID, savedCardlist);
                    }
                    catch (error) {
                        logging_1.Log("Something went wrong while saving new saved card data.");
                        logging_1.Error(error);
                        if (getNewSetArgs.verbose) {
                            return Promise.reject(['Something went wrong while trying to save new cards list.']);
                        }
                    }
                    var messages = new Array();
                    newCardlist.forEach(function (card) {
                        var message = card_helper_1.generateCardMessage(card);
                        messages.push(message);
                    });
                    return messages;
                })];
        });
    });
}
var GetNewSetArgs = /** @class */ (function () {
    function GetNewSetArgs(set, channelID, verbose) {
        this.set = set;
        this.channelID = channelID;
        this.verbose = verbose;
    }
    return GetNewSetArgs;
}());
