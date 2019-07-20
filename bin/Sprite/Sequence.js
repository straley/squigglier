"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Animations_1 = require("./Animations");
const SVGStyle_1 = require("./SVGStyle");
class Sequence {
    constructor(element) {
        this.sequenceItems = [];
        this._index = 0;
        this.actionSettings = {};
        this._element = element;
        this._style = new SVGStyle_1.SVGStyle(this._element);
    }
    element() {
        return this._element;
    }
    index() {
        return this._index;
    }
    style() {
        return this._style;
    }
    static attach(element) {
        return new Sequence(element);
    }
    settings(actionSettings = {}) {
        this.actionSettings = actionSettings;
    }
    run() {
        this._index++;
        if (this.sequenceItems.length === 0) {
            this._style.render();
            if (typeof this.finalSequenceItem === 'function') {
                this.finalSequenceItem();
            }
        }
        const sequenceItem = this.sequenceItems.shift();
        if (!sequenceItem) {
            return this;
        }
        const { action, settings } = sequenceItem;
        Object.keys(this.actionSettings).forEach(index => {
            if (typeof settings[index] === 'undefined') {
                settings[index] = this.actionSettings[index].toString();
                return this;
            }
            // add numbers as numbers
            if (!isNaN(settings[index]) && !isNaN(this.actionSettings[index])) {
                settings[index] = (parseFloat(settings[index]) + parseFloat(this.actionSettings[index])).toString();
            }
        });
        Animations_1.Animations[action](settings, this);
        return this;
    }
    finally(finalSequenceItem) {
        this.finalSequenceItem = finalSequenceItem;
        return this;
    }
    addActions(actions) {
        for (const animation of actions.animations) {
            const { action, settings } = animation;
            if (typeof Animations_1.Animations[action] === 'function') {
                this.sequenceItems.push({ action, settings });
            }
        }
        return this;
    }
}
exports.Sequence = Sequence;
//# sourceMappingURL=Sequence.js.map