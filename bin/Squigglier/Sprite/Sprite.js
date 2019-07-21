"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// base class
const Collection_1 = require("../Collection/Collection");
// allowed children
const Collection_Animations_1 = require("../Collection/Collection.Animations");
const Collection_Ons_1 = require("../Collection/Collection.Ons");
// for exporting
const Sprite_Animation_1 = require("./Animation/Sprite.Animation");
const Sprite_Filter_1 = require("./Filter/Sprite.Filter");
const Sprite_On_1 = require("./On/Sprite.On");
class Sprite extends Collection_1.Collection {
    constructor(attributesOrElement) {
        super(attributesOrElement, [Collection_Animations_1.Animations, Collection_Ons_1.Ons]);
    }
}
// export nested classes
Sprite.Animation = Sprite_Animation_1.Animation;
Sprite.Filter = Sprite_Filter_1.Filter;
Sprite.On = Sprite_On_1.On;
Sprite.tagName = 'sprite';
exports.Sprite = Sprite;
//# sourceMappingURL=Sprite.js.map