"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
const Sprite_1 = require("../Sprite/Sprite");
class Sprites extends Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Sprite_1.Sprite]);
    }
}
Sprites.tagName = 'on';
exports.Sprites = Sprites;
//# sourceMappingURL=Collection.Sprites.js.map