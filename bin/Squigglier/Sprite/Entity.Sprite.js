"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_Entities_1 = require("../../Collection/Collection.Entities");
const Entity_Sprite_Animation_Collection_1 = require("./Animation/Entity.Sprite.Animation.Collection");
const Entity_Sprite_On_Collection_1 = require("./On/Entity.Sprite.On.Collection");
class Sprite extends Collection_Entities_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Entity_Sprite_Animation_Collection_1.Collection, Entity_Sprite_On_Collection_1.Collection]);
    }
}
Sprite.tagName = 'sprite';
exports.Sprite = Sprite;
//# sourceMappingURL=Entity.Sprite.js.map