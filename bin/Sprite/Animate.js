"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Animate {
    static svgOverride(element, attributes) {
        for (const name of Object.keys(attributes)) {
            element.setAttribute(name, attributes[name]);
        }
        for (const index in element.childNodes) {
            const child = element.childNodes[index];
            if (child instanceof SVGElement) {
                this.svgOverride(child, attributes);
            }
        }
    }
}
Animate.SVG_GEO_ELEMENTS = [
    'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'text'
];
Animate.inspectSvg = function (element, results = { geos: [] }) {
    if (Animate.SVG_GEO_ELEMENTS.indexOf(element.tagName) !== -1) {
        results.geos.push(element);
        return results;
    }
    if (element.tagName === 'g' || element.tagName === 'svg') {
        for (const index in element.childNodes) {
            results = this.inspectSvg(element.childNodes[index], results);
        }
    }
    return results;
};
exports.Animate = Animate;
//# sourceMappingURL=Animate.js.map