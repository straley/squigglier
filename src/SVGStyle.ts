import { Sequence } from "./Sequence";

export type SVGCSSRule = {
  [index:string]: any
} 

export type SVGCSSRules = Array<SVGCSSRule> | SVGCSSRule

type SVGCSSRuleSet = {
  [index:string]: Array<SVGCSSRule>
}

export type RuleFamilyType = 'SELECTOR' | 'KEYFRAMES'

export class RuleFamily {
  private rules: SVGCSSRuleSet = {}
  private style: SVGStyle
  private type: RuleFamilyType
  
  constructor(style: SVGStyle, type: RuleFamilyType) {
    this.style = style
    this.type = type
  }

  public add(id: string, rules: SVGCSSRules) {
    this.rules[id] = [
      ...this.rules[id] ? this.rules[id] : [],
      ...this.toArray(rules)
    ]
  }

  public css() {
    const prefix = this.type === 'KEYFRAMES' ? '@keyframes ' : ``
    const postfix = this.type === 'KEYFRAMES' ? '' : ':'

    return Object.keys(this.rules).map(
      id => {
        const merged = this.rules[id].reduce((merged, set) => {
          Object.keys(set).forEach(attribute=>{
            merged[attribute] = [
              ...merged[attribute] ? merged[attribute] : [],
              ...set[attribute]
            ]
          })
          return merged
        }, {})

        return `${prefix}${id} {\n${
          Object.keys(merged).map(
            attribute => `${attribute}${postfix} ${
              this.type === 'KEYFRAMES'
              ? `{${merged[attribute].map(
                  (value:any) => Object.keys(value).map(
                    setting => `${setting}: ${value[setting]}; `
                  )
                )}}` 
              : `${merged[attribute].join(', ')};`}`
          ).join('\n')
        }\n}\n`
      }).join('\n')
  }

  private toArray(rules:SVGCSSRules):Array<SVGCSSRule> {
    if (!Array.isArray(rules)) {
      return [rules]
    }
    return rules
  } 
}

export class IdentifiedRuleAdder {
  private ruleFamily: RuleFamily
  private id: string
  constructor(ruleFamily: RuleFamily, id:string) {
    this.ruleFamily = ruleFamily
    this.id = id
  }
 
  public add(rules: SVGCSSRules) {
    this.ruleFamily.add(this.id, rules)
    return this
  } 
}

export class UnidentifiedRuleAdder {
  private ruleFamily: RuleFamily
  constructor(ruleFamily: RuleFamily) {
    this.ruleFamily = ruleFamily
  }
 
  public add(id: string, rules: SVGCSSRules) {
    this.ruleFamily.add(id, rules)
    return this
  }
}

export class SVGStyle {
  private element: SVGSVGElement
  private styleSheet: HTMLStyleElement
  private rules: {
    keyframes: RuleFamily,
    selector: RuleFamily
  }
  private sequence: Sequence

  constructor(element: SVGSVGElement, sequence:Sequence) {
    this.sequence = sequence
    this.rules = {
      keyframes: new RuleFamily(this, 'KEYFRAMES'),
      selector: new RuleFamily(this, 'SELECTOR'),
    }

    this.element = element
  }

  private wrap(id:string, ruleFamily: RuleFamily) {
    if (id) {
      return {
        add: (...args: any) => {
          if (!args) {
            return ruleFamily
          }  

          if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
            return ruleFamily.add(args[0], args[1])
          }

          if (args.length === 1 && typeof args[0] === 'object') {
            return ruleFamily.add(id, args[0])
          }

          return ruleFamily
        }
      }
    }
    return {
      add: (...args: any) => {
        if (!args) {
          return ruleFamily
        }  

        if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'object') {
          return ruleFamily.add(args[0], args[1])
        }

        return ruleFamily
      }
    }
  }

  public render() {
    const css = [
      this.rules.keyframes.css(),
      this.rules.selector.css()
    ].join('\n')

    this.styleSheet = document.createElement('style')
    this.styleSheet.innerHTML = css
    this.element.insertAdjacentElement('afterbegin', this.styleSheet)
  }

  public keyframes(id?: string) {
    return this.wrap(id, this.rules.keyframes)
  }

  public selector(id?: string) {
    return this.wrap(id, this.rules.selector)
  }
}