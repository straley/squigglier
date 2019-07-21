"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../../Entity");
const Entity_Sprite_Animation_Collection_1 = require("./Entity.Sprite.Animation.Collection");
class Animation extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement);
    }
}
Animation.Collection = Entity_Sprite_Animation_Collection_1.Collection;
exports.Animation = Animation;
//# sourceMappingURL=Entity.Sprite.Animation.js.map