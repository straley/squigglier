"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityCollection_1 = require("../EntityCollection");
const SpriteAnimationCollection_1 = require("./SpriteAnimation/SpriteAnimationCollection");
const SpriteOnCollection_1 = require("./SpriteOn/SpriteOnCollection");
const SpriteAnimation_1 = require("./SpriteAnimation/SpriteAnimation");
class Sprite extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [SpriteAnimationCollection_1.Collection, SpriteOnCollection_1.Collection]);
    }
}
Sprite.tagName = 'sprite';
Sprite.Animation = SpriteAnimation_1.Animation;
exports.Sprite = Sprite;
//# sourceMappingURL=Sprite.js.map