"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EntityCollection_1 = require("../../EntityCollection");
const SpriteOnClick_1 = require("./SpriteOnClick");
class SpriteOn extends EntityCollection_1.EntityCollection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [SpriteOnClick_1.SpriteOnClick]);
    }
}
SpriteOn.tagName = 'on';
exports.SpriteOn = SpriteOn;
//# sourceMappingURL=index.js.map