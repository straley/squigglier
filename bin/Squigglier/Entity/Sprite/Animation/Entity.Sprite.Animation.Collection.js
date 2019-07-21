"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_Collection_1 = require("../../Entity.Collection");
class Collection extends Entity_Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Collection]);
    }
}
Collection.tagName = 'animations';
exports.Collection = Collection;
//# sourceMappingURL=Entity.Sprite.Animation.Collection.js.map