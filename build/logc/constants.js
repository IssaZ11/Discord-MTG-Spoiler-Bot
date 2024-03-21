"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var appDir = path_1.default.resolve('./');
var DATADIRECTORY = appDir + "/data";
var SETTINGSPATH = DATADIRECTORY + "/settings.json";
var WATCHEDSETCODESPATH = DATADIRECTORY + "/watchedsetcodes.json";
var MESSAGEINTERVAL = 1500;
var APICALLINTERVAL = 500;
var BASICLANDNAMES = ["plains", "island", "swamp", "mountain", "forest"];
exports.default = {
    BOTDEFAULTPREFIX: "!",
    BOTNECESSARYPERMISSION: "MANAGE_MESSAGES",
    SPOILERWATCHINTERVALTIME: 1000 * 60 * 10,
    DATADIRECTORY: DATADIRECTORY,
    SETTINGSPATH: SETTINGSPATH,
    WATCHEDSETCODESPATH: WATCHEDSETCODESPATH,
    MESSAGEINTERVAL: MESSAGEINTERVAL,
    APICALLINTERVAL: APICALLINTERVAL,
    BASICLANDNAMES: BASICLANDNAMES,
};
