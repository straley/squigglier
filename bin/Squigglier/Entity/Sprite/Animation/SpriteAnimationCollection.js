"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = require("../Sprite");
const EntityCollection_1 = require("../../EntityCollection");
class Collection extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Sprite_1.Sprite.Animation.Collection]);
    }
}
Collection.tagName = 'animations';
exports.Collection = Collection;
//# sourceMappingURL=SpriteAnimationCollection.js.map