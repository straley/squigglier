"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuleFamily {
    constructor(type) {
        this.rules = {};
        this.type = type;
    }
    add(id, rules) {
        this.rules[id] = [
            ...this.rules[id] ? this.rules[id] : [],
            ...this.toArray(rules)
        ];
    }
    css() {
        const prefix = this.type === 'KEYFRAMES' ? '@keyframes ' : ``;
        const postfix = this.type === 'KEYFRAMES' ? '' : ':';
        return Object.keys(this.rules).map(id => {
            const merged = this.rules[id].reduce((merged, set) => {
                Object.keys(set).forEach(attribute => {
                    merged[attribute] = [
                        ...merged[attribute] ? merged[attribute] : [],
                        ...set[attribute]
                    ];
                });
                return merged;
            }, {});
            return `${prefix}${id} {\n${Object.keys(merged).map(attribute => `${attribute}${postfix} ${this.type === 'KEYFRAMES'
                ? `{${merged[attribute].map((value) => Object.keys(value).map(setting => `${setting}: ${value[setting]}; `))}}`
                : `${merged[attribute].join(', ')};`}`).join('\n')}\n}\n`;
        }).join('\n');
    }
    toArray(rules) {
        if (!Array.isArray(rules)) {
            return [rules];
        }
        return rules;
    }
}
exports.RuleFamily = RuleFamily;
class IdentifiedRuleAdder {
    constructor(ruleFamily, id) {
        this.ruleFamily = ruleFamily;
        this.id = id;
    }
    add(rules) {
        this.ruleFamily.add(this.id, rules);
        return this;
    }
}
exports.IdentifiedRuleAdder = IdentifiedRuleAdder;
class UnidentifiedRuleAdder {
    constructor(ruleFamily) {
        this.ruleFamily = ruleFamily;
    }
    add(id, rules) {
        this.ruleFamily.add(id, rules);
        return this;
    }
}
exports.UnidentifiedRuleAdder = UnidentifiedRuleAdder;
class SVGStyle {
    constructor(element) {
        this.rules = {
            keyframes: new RuleFamily('KEYFRAMES'),
            selector: new RuleFamily('SELECTOR'),
        };
        this.element = element;
    }
    wrap(id, ruleFamily) {
        if (id) {
            return {
                add: (...args) => {
                    if (!args) {
                        return ruleFamily;
                    }
                    if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
                        return ruleFamily.add(args[0], args[1]);
                    }
                    if (args.length === 1 && typeof args[0] === 'object') {
                        return ruleFamily.add(id, args[0]);
                    }
                    return ruleFamily;
                }
            };
        }
        return {
            add: (...args) => {
                if (!args) {
                    return ruleFamily;
                }
                if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
                    return ruleFamily.add(args[0], args[1]);
                }
                return ruleFamily;
            }
        };
    }
    render() {
        const css = [
            this.rules.keyframes.css(),
            this.rules.selector.css()
        ].join('\n');
        this.styleSheet = document.createElement('style');
        this.styleSheet.innerHTML = css;
        this.element.insertAdjacentElement('afterbegin', this.styleSheet);
    }
    keyframes(id) {
        return this.wrap(id, this.rules.keyframes);
    }
    selector(id) {
        return this.wrap(id, this.rules.selector);
    }
}
exports.SVGStyle = SVGStyle;
//# sourceMappingURL=SVGStyle.js.map