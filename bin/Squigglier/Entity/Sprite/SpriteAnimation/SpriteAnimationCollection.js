"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __importDefault(require("../Sprite"));
const EntityCollection_1 = require("../../EntityCollection");
class Collection extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Sprite_1.default.Animation.Freehand]);
    }
}
Collection.tagName = 'animations';
exports.Collection = Collection;
//# sourceMappingURL=SpriteAnimationCollection.js.map