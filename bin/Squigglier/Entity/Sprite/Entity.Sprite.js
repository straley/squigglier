"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_Collection_1 = require("../Entity.Collection");
const Entity_Sprite_Animation_Collection_1 = require("./Animation/Entity.Sprite.Animation.Collection");
const Entity_Sprite_OnCollection_1 = require("./On/Entity.Sprite.OnCollection");
class Sprite extends Entity_Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Entity_Sprite_Animation_Collection_1.Collection, Entity_Sprite_OnCollection_1.Collection]);
    }
}
Sprite.tagName = 'sprite';
exports.Sprite = Sprite;
//# sourceMappingURL=Entity.Sprite.js.map