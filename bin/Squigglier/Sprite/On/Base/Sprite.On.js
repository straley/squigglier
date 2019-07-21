"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// base class
const Entity_Data_1 = require("../../Entity/Entity.Data");
// for exporting
const Sprite_On_Click_1 = require("./Sprite.On.Click");
class On extends Entity_Data_1.Data {
}
// export nested classes
On.Click = Sprite_On_Click_1.Click;
exports.On = On;
//# sourceMappingURL=Sprite.On.js.map