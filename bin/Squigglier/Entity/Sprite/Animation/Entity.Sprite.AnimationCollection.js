"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_Sprite_1 = require("../Entity.Sprite");
const Entity_Collection_1 = require("../../Entity.Collection");
class Collection extends Entity_Collection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Entity_Sprite_1.Sprite.Animation.Collection]);
    }
}
Collection.tagName = 'animations';
exports.Collection = Collection;
//# sourceMappingURL=Entity.Sprite.AnimationCollection.js.map