"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Animate_1 = require("./Animate");
class Filters {
    static animate(element, settings = {}) {
        Animate_1.Animate.svgOverride(element, settings);
    }
}
exports.Filters = Filters;
//# sourceMappingURL=Filters.js.map