"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityCollection_1 = require("../../EntityCollection");
const SpriteOn_1 = require("./SpriteOn");
class Collection extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [SpriteOn_1.On]);
    }
}
Collection.tagName = 'on';
exports.Collection = Collection;
//# sourceMappingURL=SpriteOnCollection.js.map