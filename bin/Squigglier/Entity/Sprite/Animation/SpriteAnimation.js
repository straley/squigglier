"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../../Entity");
const SpriteAnimationCollection_1 = require("./SpriteAnimationCollection");
class Animation extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement);
    }
}
Animation.Collection = SpriteAnimationCollection_1.Collection;
exports.Animation = Animation;
//# sourceMappingURL=SpriteAnimation.js.map