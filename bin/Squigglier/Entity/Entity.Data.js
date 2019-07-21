"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// base class
const Entity_1 = require("./Entity");
class Data extends Entity_1.Entity {
    constructor(attributesOrElement, defaultAttributes) {
        super(attributesOrElement, defaultAttributes);
        this.mapElementData();
    }
    mapElementData() {
        if (!this.element) {
            return;
        }
        this.data = this.element.textContent;
    }
}
exports.Data = Data;
//# sourceMappingURL=Entity.Data.js.map