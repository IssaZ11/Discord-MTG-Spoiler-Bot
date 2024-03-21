"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.Log = void 0;
/**
 * Logs the given message to the console with a human readable date prefixed
 */
function Log(message) {
    console.log(getReadableDate() + " - " + message);
}
exports.Log = Log;
/**
 * Logs the given message to the console as an error with a human readable date prefixed
 */
function Error(message) {
    console.error(getReadableDate() + " - ERROR: " + message);
}
exports.Error = Error;
/**
 * Returns the current date in a readable format
 */
function getReadableDate() {
    var today = new Date();
    var date = today.getDate();
    var month = today.getMonth() + 1; //January is 0!
    var hour = today.getHours();
    var minute = today.getMinutes();
    var year = today.getFullYear();
    var dateString = date.toString();
    var monthString = month.toString();
    var hourString = hour.toString();
    var minuteString = minute.toString();
    if (date < 10) {
        dateString = "0" + date;
    }
    if (month < 10) {
        monthString = "0" + month;
    }
    if (hour < 10) {
        hourString = "0" + hour;
    }
    if (minute < 10) {
        minuteString = "0" + minute;
    }
    return "[" + dateString + "/" + monthString + "/" + year + " " + hourString + ":" + minuteString + "]";
}
