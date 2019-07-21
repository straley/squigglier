"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../Base/Entity");
class Collection extends Entity_1.Entity {
    constructor(attributesOrElement, allowedChildren) {
        super(attributesOrElement);
        this.allowedChildren = allowedChildren;
        this.mapElementChildren();
    }
    elementToClassReference(element) {
        if (!this.allowedChildren) {
            return;
        }
        if (!element.tagName) {
            return;
        }
        const classReference = this.allowedChildren.find(child => child.tagName === element.tagName.toLowerCase());
        if (!classReference) {
            return;
        }
        const childClass = classReference;
        return childClass;
    }
    mapElementChildren() {
        if (!this.element) {
            return;
        }
        this.children = [];
        for (const child of this.element.children) {
            const reference = this.elementToClassReference(child);
            if (!reference) {
                continue;
            }
            this.children.push(new reference(child));
        }
    }
}
exports.Collection = Collection;
//# sourceMappingURL=Entity.Collection.js.map