"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Animate_1 = require("./Animate");
const Freehand_1 = require("./Animations/Freehand");
const FillIn_1 = require("./Animations/FillIn");
class Animations {
    // todo:getPointsFromGeos
    // https://github.com/colinmeinke/svg-points/blob/master/src/toPoints.js
    // expands delimited (usually comma or semicolon) list of keys or key
    // value pairs (colon-separated)
    static expandSettingValue(value, delimiter) {
        return value
            ? value.split(delimiter).reduce((obj, pair) => {
                const parts = pair.split(/:/);
                obj[parts[0]] = parts.length > 1 ? parts[1] : true;
                return obj;
            }, {})
            : {};
    }
    // given an svg element, styles and rules (expanded with expandSettingValue), 
    // and a condition check callback, this will determine if the element should
    // be ignored
    static checkIgnore(element, styles, rules, condition) {
        for (const rule in rules) {
            const attr = element.getAttribute(rule) || styles[rule];
            const ignore = condition(rules[rule], attr);
            if (ignore) {
                return true;
            }
        }
        return false;
    }
    // given an SVGElement, all of the rules (limits, excludes, etc.), and settings
    // provide a set of geometries
    static applyValidGeometries(element, settings = {}) {
        const svgAttributes = Animate_1.Animate.inspectSvg(element);
        const geos = {};
        const limits = Animations.expandSettingValue(settings.limit, /[\,\&]/);
        const excludes = Animations.expandSettingValue(settings.exclude, /[\,\&]/);
        for (const index in svgAttributes.geos) {
            const geo = svgAttributes.geos[index];
            const styles = Animations.expandSettingValue(geo.getAttribute('style'), /\s*;\s*/);
            if (!(Animations.checkIgnore(geo, styles, limits, (ruleValue, attributeValue) => (ruleValue !== (typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue))) ||
                Animations.checkIgnore(geo, styles, excludes, (ruleValue, attributeValue) => (ruleValue === (typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue))))) {
                geos[index] = geo;
            }
        }
        return geos;
    }
    // given a set of geometries, build metadata for rendering 
    static geometriesToGeoMeta(geometries, minLength, targetDuration) {
        const meta = Object.keys(geometries).reduce((info, index) => {
            const geo = geometries[index];
            const length = geo.getTotalLength();
            const drawable = length >= minLength;
            const totalDrawableGeoLength = drawable
                ? info.totalDrawableGeoLength + length
                : info.totalDrawableGeoLength;
            const totalGeoLength = info.totalGeoLength + length;
            const duration = drawable
                ? (length / totalDrawableGeoLength) * targetDuration
                : Animations.NONDRAWABLE_DURATION;
            const geoData = Object.assign({}, info.geoData, { [index]: Object.assign({}, info.geoData[index] || {}, { geo,
                    length,
                    drawable,
                    duration }) });
            return {
                totalDrawableGeoLength,
                totalGeoLength,
                totalDelay: 0,
                geoData,
            };
        }, {
            totalGeoLength: 0,
            totalDrawableGeoLength: 0,
            totalDelay: 0,
            geoData: {}
        });
        const { geoData } = meta;
        // determine adjustment to durations based upon number of drawable geos
        const totalDurations = Object.keys(geoData)
            .reduce((duration, index) => duration + geoData[index].duration, 0);
        const durationAdjustment = targetDuration / totalDurations;
        // determine timing of each geo
        // todo: this is for sequential
        Object.keys(geoData)
            .sort((a, b) => geoData[a].length > geoData[b].length ? -1 : 1)
            .forEach(index => {
            const data = geoData[index];
            data.duration *= durationAdjustment;
            data.delay = meta.totalDelay;
            meta.totalDelay += data.duration;
        });
        return meta;
    }
    static withStyleSheet(callback) {
        const styleSheet = (document.styleSheets && document.styleSheets[0]);
        if (styleSheet) {
            callback(styleSheet);
        }
    }
    static defaultFloat(value, defaultValue) {
        return typeof value !== 'undefined' && value !== null && parseFloat(value)
            ? parseFloat(value)
            : defaultValue;
    }
}
Animations.NONDRAWABLE_DURATION = 0.5;
// usable animations 
Animations.freehand = Freehand_1.Freehand.render;
Animations.fillin = FillIn_1.FillIn.render;
exports.Animations = Animations;
//# sourceMappingURL=Animations.js.map