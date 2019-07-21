"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_Animation_1 = require("./Sprite.Animation");
class Freehand extends Sprite_Animation_1.Animation {
    constructor(attributesOrElement) {
        super(attributesOrElement, {
            width: 20,
            minLength: 50
        });
    }
}
Freehand.tagName = 'freehand';
exports.Freehand = Freehand;
//# sourceMappingURL=Sprite.Animation.Freehand.js.map