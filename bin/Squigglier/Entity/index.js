"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(attributesOrElement, defaultAttributes) {
        if (defaultAttributes) {
            this.attributes = Object.assign({}, this.attributes, defaultAttributes);
        }
        this.className = this.constructor.name;
        this.element = attributesOrElement;
        this.mapElementAttributes();
    }
    mapElementAttributes() {
        if (!this.element) {
            return;
        }
        this.attributes = this.element.getAttributeNames().reduce((attributes, index) => {
            attributes[index] = this.element.getAttribute(index);
            return attributes;
        }, this.attributes || {});
    }
}
exports.Entity = Entity;
//# sourceMappingURL=index.js.map