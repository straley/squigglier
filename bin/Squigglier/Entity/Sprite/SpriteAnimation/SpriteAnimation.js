"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../../Entity");
const SpriteAnimationCollection_1 = require("./SpriteAnimationCollection");
const SpriteAnimationFreehand_1 = require("./SpriteAnimationFreehand");
exports.default = {
    Collection: SpriteAnimationCollection_1.Collection,
    Freehand: SpriteAnimationFreehand_1.Freehand
};
class Animation extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement);
    }
}
exports.Animation = Animation;
//# sourceMappingURL=SpriteAnimation.js.map