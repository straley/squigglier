"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../../Entity");
class Freehand extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement, {
            width: 20,
            minLength: 50
        });
    }
}
Freehand.tagName = 'freehand';
exports.Freehand = Freehand;
//# sourceMappingURL=SpriteAnimationFreehand.js.map