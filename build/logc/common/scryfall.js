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
exports.scryfallGetSet = exports.scryfallGetCard = void 0;
var https_1 = __importDefault(require("https"));
var logging_1 = require("./logging");
var constants_1 = __importDefault(require("../constants"));
var GET_CARD_ERROR = 'Something went wrong searching for your card, please wait a moment and try again';
var GET_SET_ERROR = 'Something went wrong getting data for that set, please wait a moment and try again';
function scryfallGetCard(name, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var data, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, makeScryfallAPICall("https://api.scryfall.com/cards/named?fuzzy=" + name).catch(function (err) {
                        return Promise.reject(err);
                    })];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, _parseCard(data, name).catch(function (err) {
                            return Promise.reject(err);
                        })];
                case 2:
                    card = _a.sent();
                    return [2 /*return*/, callback(card, name)];
            }
        });
    });
}
exports.scryfallGetCard = scryfallGetCard;
function _parseCard(data, name) {
    return new Promise(function (resolve, reject) {
        var card;
        try {
            // Parse the data in the response
            var cardData = JSON.parse(data);
            card = cardData;
            if (card) {
                logging_1.Log("Found card with name like " + name + ": " + card.name);
                resolve(card);
            }
            else {
                logging_1.Log('Expected \'card\' object from Scryfall but could not parse, got the following:');
                logging_1.Log(cardData);
                reject(GET_CARD_ERROR);
            }
        }
        catch (error) {
            logging_1.Log('Something went wrong while trying to parse data from Scryfall.');
            logging_1.Error(error);
            reject(GET_CARD_ERROR);
        }
    });
}
function scryfallGetSet(set, ignoreBasics, callback, args) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, data, cardlist, cards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = "https://api.scryfall.com/cards/search?order=spoiled&q=e%3A" + set + "&unique=prints";
                    return [4 /*yield*/, makeScryfallAPICall(endpoint).catch(function (err) {
                            return Promise.reject(err);
                        })];
                case 1:
                    data = _a.sent();
                    return [4 /*yield*/, _parseSet(data, set, ignoreBasics).catch(function (err) {
                            return Promise.reject(err);
                        })];
                case 2:
                    cardlist = _a.sent();
                    cards = cardlist.data;
                    _a.label = 3;
                case 3:
                    if (!(cardlist.has_more && cardlist.next_page)) return [3 /*break*/, 7];
                    logging_1.Log("Response was paginated, trying to get next page from " + cardlist.next_page + ".");
                    logging_1.Log("Currently at " + cards.length + " cards out of a total " + cardlist.total_cards + ".");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, constants_1.default.APICALLINTERVAL); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, makeScryfallAPICall(cardlist.next_page).catch(function (err) {
                            return Promise.reject(err);
                        })];
                case 5:
                    data = _a.sent();
                    return [4 /*yield*/, _parseSet(data, set, ignoreBasics).catch(function (err) {
                            return Promise.reject(err);
                        })];
                case 6:
                    cardlist = _a.sent();
                    cards = cards.concat(cardlist.data);
                    return [3 /*break*/, 3];
                case 7: return [2 /*return*/, callback(cards, args)];
            }
        });
    });
}
exports.scryfallGetSet = scryfallGetSet;
function _parseSet(data, set, ignoreBasics) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        // Parse the data in the response
                        var cardlistData = JSON.parse(data);
                        var cardlist = cardlistData;
                        if (cardlist) {
                            if (cardlist.object === 'list') {
                                // Log any warnings in the API response
                                if (cardlist.warnings) {
                                    cardlist.warnings.forEach(function (warning) {
                                        logging_1.Log(warning);
                                    });
                                }
                                // Remove basics from the list if ignored
                                if (ignoreBasics) {
                                    logging_1.Log('Ignoring basic lands');
                                    cardlist.data = cardlist.data.filter(function (card) {
                                        return !constants_1.default.BASICLANDNAMES.includes(card.name.toLowerCase());
                                    });
                                }
                                // If new list is empty, no new cards were found
                                if (!cardlist.total_cards || cardlist.total_cards <= 0) {
                                    logging_1.Log("No cards were found with set code " + set);
                                    reject("No cards were found with set code " + set + ".");
                                }
                                else {
                                    // If new list wasn't empty, send one of the new cards to the channel every second
                                    logging_1.Log(cardlist.data.length + " cards were found with set code " + set + " out of a total of " + cardlist.total_cards);
                                    resolve(cardlist);
                                }
                            }
                            else {
                                logging_1.Log("Expected 'list' object from Scryfall but got type '" + cardlist.object + "', with the following data");
                                logging_1.Log(cardlistData);
                                reject(GET_SET_ERROR);
                            }
                        }
                        else {
                            logging_1.Log('Expected \'list\' object from Scryfall but could not parse, got the following:');
                            logging_1.Log(cardlistData);
                            reject(GET_SET_ERROR);
                        }
                    }
                    catch (error) {
                        logging_1.Log('Something went wrong with parsing data from Scryfall.');
                        logging_1.Error(error);
                        reject(GET_SET_ERROR);
                    }
                })];
        });
    });
}
function makeScryfallAPICall(endpoint) {
    return new Promise(function (resolve, reject) {
        // Make a request to the Scryfall api
        https_1.default.get(endpoint, function (resp) {
            var data = '';
            // A chunk of data has been received.
            resp.on('data', function (chunk) {
                data += chunk;
            });
            // The whole response has been received.
            resp.on('end', function () {
                return resolve(data);
            });
        })
            .on('error', function (err) {
            logging_1.Log('Something went wrong while trying to get data from Scryfall.');
            logging_1.Error(err.message);
            return reject(GET_SET_ERROR);
        });
    });
}
