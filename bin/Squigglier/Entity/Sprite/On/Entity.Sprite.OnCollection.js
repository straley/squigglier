"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_Collection_1 = require("../../Entity.Collection");
const Entity_Sprite_On_1 = require("./Entity.Sprite.On");
class Collection extends Entity_Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Entity_Sprite_On_1.On]);
    }
}
Collection.tagName = 'on';
exports.Collection = Collection;
//# sourceMappingURL=Entity.Sprite.OnCollection.js.map