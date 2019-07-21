"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_Entities_1 = require("../../Collection/Collection.Entities");
const Entity_Sprite_On_1 = require("./Entity.Sprite.On");
class Collection extends Collection_Entities_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Entity_Sprite_On_1.On]);
    }
}
Collection.tagName = 'on';
exports.Collection = Collection;
//# sourceMappingURL=Entity.Sprite.On.Collection.js.map