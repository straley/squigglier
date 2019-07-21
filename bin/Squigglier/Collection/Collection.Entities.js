"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
const Entity_1 = require("../Entity/Entity");
class Entities extends Collection_1.Collection {
    constructor(element) {
        super(element, [Entity_1.Entity]);
    }
}
exports.Entities = Entities;
//# sourceMappingURL=Collection.Entities.js.map