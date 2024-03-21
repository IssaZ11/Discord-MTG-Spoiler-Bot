"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCardMessage = void 0;
var lodash_1 = __importDefault(require("lodash"));
/**
 * Creates a formatted message describing the given card and returns it
 */
function generateCardMessage(card) {
    return generateDescriptionText(card);
}
exports.generateCardMessage = generateCardMessage;
/**
 * Generates the formatted text description of the given card
 * @author Original by NoxxFlame, adapted by Jozeevis
 */
function generateDescriptionText(card) {
    var description = [];
    if (!card.card_faces) {
        var cardCost = card.mana_cost
            ? card.mana_cost.replace(new RegExp('[{}]', 'g'), '')
            : '';
        var nameLine = "**" + card.name + "**";
        if (cardCost) {
            nameLine += " - " + cardCost;
        }
        description.push(nameLine);
        if (card.printed_type_line || card.type_line) {
            // bold type line
            var type = "" + (card.printed_type_line || card.type_line);
            type += " (" + lodash_1.default.capitalize(card.rarity) + ")";
            description.push(type);
        }
        if (card.printed_text || card.oracle_text) {
            // reminder text in italics
            var text = card.printed_text || card.oracle_text;
            if (text) {
                description.push(text.replace(/[()]/g, function (m) { return (m === '(' ? '_(' : ')_'); }));
            }
        }
        if (card.flavor_text) {
            // flavor text in italics
            description.push("_" + card.flavor_text + "_");
        }
        if (card.loyalty) {
            // bold loyalty
            description.push("**Loyalty: " + card.loyalty + "**");
        }
        if (card.power) {
            // bold P/T
            description.push(powerToughnessToString(card));
        }
        if (card.image_uris) {
            description.push(getImageUrl(card.image_uris));
        }
    }
    else {
        // split cards are special
        var nameLine = "**" + card.name + "**";
        nameLine += " _(2-faced card)_";
        description.push(nameLine);
        card.card_faces.forEach(function (face) {
            var faceCost = face.mana_cost
                ? face.mana_cost.replace(new RegExp('[{}]', 'g'), '')
                : '';
            var nameLine = "**" + face.name + "**";
            if (faceCost) {
                nameLine += " - " + faceCost;
            }
            description.push(nameLine);
            if (face.type_line) {
                var type = "" + (face.printed_type_line || face.type_line);
                type += " (" + lodash_1.default.capitalize(card.rarity) + ")";
                description.push(type);
            }
            if (face.oracle_text) {
                description.push(face.oracle_text.replace(/[()]/g, function (m) {
                    return m === '(' ? '_(' : ')_';
                }));
            }
            if (face.power) {
                description.push(powerToughnessToString(face));
            }
            if (face.image_uris) {
                description.push(getImageUrl(face.image_uris));
            }
            description.push('');
        });
    }
    return description.join('\n');
}
/**
 * Returns url from the given imageUris object if a fitting one could be found
 * Prioritizes formats as follows: normal > large > small > png
 */
function getImageUrl(imageUris) {
    if (imageUris.normal) {
        return imageUris.normal;
    }
    else if (imageUris.large) {
        return imageUris.large;
    }
    else if (imageUris.small) {
        return imageUris.small;
    }
    else if (imageUris.png) {
        return imageUris.png;
    }
    return '';
}
function powerToughnessToString(object) {
    if (!object.power || !object.toughness) {
        return '';
    }
    var powerString = escape(object.power).replace(/\*/g, '\\*');
    var toughnessString = escape(object.toughness).replace(/\*/g, '\\*');
    return "**" + powerString + "/" + toughnessString + "**";
}
