"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../Entity");
const SpriteAnimationFreehand_1 = require("./SpriteAnimation/SpriteAnimationFreehand");
class Animation extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement);
    }
}
exports.Animation = Animation;
(function (Animation) {
    Animation.Freehand = SpriteAnimationFreehand_1.Freehand;
})(Animation = exports.Animation || (exports.Animation = {}));
//# sourceMappingURL=SpriteAnimation.js.map