"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
const Sprite_1 = require("../Sprite/Sprite");
class Animations extends Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Sprite_1.Sprite.Animation]);
    }
}
Animations.tagName = 'animations';
exports.Animations = Animations;
//# sourceMappingURL=Collection.Animations.js.map