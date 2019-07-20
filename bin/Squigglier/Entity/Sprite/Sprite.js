"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntityCollection_1 = require("../EntityCollection");
const SpriteAnimationCollection_1 = require("./SpriteAnimation/SpriteAnimationCollection");
const SpriteOn_1 = require("./SpriteOn/SpriteOn");
const SpriteAnimation_1 = __importDefault(require("./SpriteAnimation/SpriteAnimation"));
exports.default = {
    Animation: SpriteAnimation_1.default
};
class Sprite extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [SpriteAnimationCollection_1.Collection, SpriteOn_1.SpriteOn]);
    }
}
Sprite.tagName = 'sprite';
exports.Sprite = Sprite;
(function (Sprite) {
    var Animation;
    (function (Animation) {
        Collection: SpriteAnimationCollection_1.Collection;
    })(Animation = Sprite.Animation || (Sprite.Animation = {}));
})(Sprite = exports.Sprite || (exports.Sprite = {}));
//# sourceMappingURL=Sprite.js.map