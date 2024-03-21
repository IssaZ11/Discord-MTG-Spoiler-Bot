"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
var constants_1 = __importDefault(require("../constants"));
/**
 * Checks if the user who sent the given message has the required discord permission as defined in constants.
 * Sends a message in the channel if the user does not have the required permission to notify them of this.
 * @returns true if the user has the right permission, false otherwise
 */
function checkPermissions(message) {
    var _a;
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.hasPermission(constants_1.default.BOTNECESSARYPERMISSION))) {
        message.channel.send("You do not have permissions to use that command.");
        return false;
    }
    return true;
}
exports.checkPermissions = checkPermissions;
