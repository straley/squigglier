"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// base class
const Collection_1 = require("./Collection");
const Sprite_On_1 = require("../Sprite/On/Sprite.On");
class Ons extends Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Sprite_On_1.On.Click]);
    }
}
Ons.tagName = 'on';
exports.Ons = Ons;
//# sourceMappingURL=Collection.Ons.js.map