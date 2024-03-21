"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var discord_js_1 = __importDefault(require("discord.js"));
var auth_json_1 = __importDefault(require("./auth.json"));
var constants_1 = __importDefault(require("./logic/constants"));
var io_1 = require("./logic/common/io");
var commands = __importStar(require("./logic/commands"));
var logging_1 = require("./logic/common/logging");
var permissions = __importStar(require("./logic/common/permissions"));
// Initialize Discord Bot
logging_1.Log("Initializing bot...");
global.bot = new discord_js_1.default.Client(); /* global bot */
try {
    global.bot.login(auth_json_1.default.token);
}
catch (err) {
    logging_1.Error(err);
}
//When bot is ready
global.bot.on("ready", function () {
    var _a, _b;
    logging_1.Log("Connected!");
    logging_1.Log("Logged in as: " + ((_a = global.bot.user) === null || _a === void 0 ? void 0 : _a.username) + " - (" + ((_b = global.bot.user) === null || _b === void 0 ? void 0 : _b.id) + ")");
    // Initialize savedIntervals and watchedSetcodes
    global.savedIntervals = [];
    global.prefix = io_1.readPrefix(constants_1.default.BOTDEFAULTPREFIX); /* global prefix */
    io_1.readWatchedSets();
});
//When bot reads message
global.bot.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var args, cmd, arg2, arg3, queryIndex, query, bool, bool;
    return __generator(this, function (_a) {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with the specified prefix
        if (message.content.substring(0, global.prefix.length) == global.prefix) {
            try {
                args = message.content.substring(global.prefix.length).split(" ");
                cmd = args[0];
                args = args.splice(1);
                arg2 = args[0];
                arg3 = void 0;
                if (args.length > 1) {
                    arg3 = args[1];
                }
                switch (cmd.toLowerCase()) {
                    // Response test
                    case "ping":
                        message.channel.send('Pong!');
                        break;
                    // Tries to find a card with name like the given name and send it in the current channel
                    case "get":
                        queryIndex = message.content.indexOf(" ") + 1;
                        if (queryIndex > 0) {
                            query = message.content.substring(queryIndex);
                            if (query) {
                                commands.getCardCommand(message.channel, query);
                            }
                            else {
                                message.channel.send("You have to supply a query, like so:\n" + global.prefix + "get Sonic Assault");
                            }
                        }
                        else {
                            message.channel.send("You have to supply a query, like so:\n" + global.prefix + "get Sonic Assault");
                        }
                        break;
                    // Get all cards from the given set and send them in the current channel
                    case "getall":
                    case "getallcards":
                        if (permissions.checkPermissions(message)) {
                            bool = arg3 === "true";
                            commands.getAllCardsCommand(message.channel, arg2, bool);
                        }
                        break;
                    // Get all new cards from the given set and send them in the current channel
                    case "getnew":
                    case "getnewcards":
                        if (permissions.checkPermissions(message)) {
                            bool = arg3 === "true";
                            commands.getNewCardsCommand(message.channel, arg2, true, bool);
                        }
                        break;
                    // Start spoilerwatch for the given set ID in the current channel
                    case "watch":
                    case "startwatch":
                        if (permissions.checkPermissions(message)) {
                            commands.startWatchCommand(message.channel, arg2);
                        }
                        break;
                    // Stop spoilerwatch for the given set ID in the current channel
                    case "unwatch":
                    case "stopwatch":
                        if (permissions.checkPermissions(message)) {
                            commands.stopWatchCommand(message.channel, arg2);
                        }
                        break;
                    // Clears the saved data for the given set in the current channel
                    case "clear":
                        if (permissions.checkPermissions(message)) {
                            commands.clearCommand(message.channel, arg2);
                        }
                        break;
                    // Changes the prefix the bot uses for its commands
                    case "prefix":
                        if (permissions.checkPermissions(message)) {
                            commands.prefixCommand(message.channel, arg2);
                        }
                        break;
                    // Sends a list of all possible commands
                    case "help":
                        commands.helpCommand(message.channel, global.prefix);
                        break;
                    default:
                        message.channel.send("No command " + cmd + " found, please check your spelling or use " + global.prefix + "help for a list of possible commands.");
                        break;
                }
            }
            catch (error) {
                logging_1.Error("(UNCAUGHT) " + error);
                message.channel.send("Something went wrong.");
            }
        }
        return [2 /*return*/];
    });
}); });
// Reconnect if the bot is disconnected gracefully
global.bot.on("disconnect", function (errMsg, code) {
    logging_1.Error("code " + code + " : " + errMsg);
    if (code === 1000) {
        try {
            global.bot.login(auth_json_1.default.token);
        }
        catch (err) {
            logging_1.Error(err);
        }
    }
});
