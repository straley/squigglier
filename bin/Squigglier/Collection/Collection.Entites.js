"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("../Base/Collection");
const Entity_Sprite_1 = require("../Entity/Sprite/Entity.Sprite");
class Entities extends Collection_1.Collection {
    constructor(element) {
        super(element, [Entity_Sprite_1.Sprite]);
    }
}
exports.Entities = Entities;
//# sourceMappingURL=Collection.Entites.js.map