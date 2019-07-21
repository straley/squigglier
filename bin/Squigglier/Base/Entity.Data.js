"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("./Entity");
class EntityData extends Entity_1.Entity {
    constructor(attributesOrElement) {
        super(attributesOrElement);
        this.mapElementData();
    }
    mapElementData() {
        if (!this.element) {
            return;
        }
        this.data = this.element.textContent;
    }
}
exports.EntityData = EntityData;
//# sourceMappingURL=Entity.Data.js.map