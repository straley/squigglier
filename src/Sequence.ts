import { Animations } from './Animations'
import { CommandSettings } from './Loader';

export type SequenceAction = {
  command: string,
  settings: any
}

export type SequenceActions = Array<SequenceAction>


export class Sequence {
  private actions: SequenceActions = []
  private _index:number = 0
  private _element: SVGSVGElement
  private _target :SVGSVGElement
  public _keyframesRules: {[index:string]: string} = {}
  private _selectorRules: {[index:string]: string} = {}

  constructor(
    element: SVGSVGElement,
    target: SVGSVGElement
  ) {
    this._element = element
    this._target = target
  }

  element() {
    return this._element
  }

  target() {
    return this._target
  }

  index() {
    return this._index
  }

  public nextAction(actionSettings: any = {}) {
    this._index++

    if (this.actions.length === 0) {
      // unpack css
      Animations.withStyleSheet(styleSheet => {

        Object.keys(this._keyframesRules).forEach(id => {
          styleSheet.insertRule(`@keyframes ${id} ${this._keyframesRules[id]}`)
        })

        Object.keys(this._selectorRules).forEach(id => {
          styleSheet.insertRule(`${id} ${this._selectorRules[id]}`)
        })
      })

      this._target.outerHTML = this._element.outerHTML
      return this
    }

    const action = this.actions.shift()
    const { command, settings } = action

    Object.keys(actionSettings).forEach(index => {
      if (typeof settings[index] === 'undefined') {
        settings[index] = actionSettings[index].toString()
        return this
      }

      if (!isNaN(settings[index]) && !isNaN(actionSettings[index])) {
        settings[index] = (parseFloat(settings[index]) + parseFloat(actionSettings[index])).toString()
      }
    })

    Animations[command](settings, this)

    return this
  }

  public addActions(actions: Array<CommandSettings>) {
    for (const action of actions) {
      const {command, settings} = action
      if (typeof Animations[command] === 'function') {
        this.actions.push({ command, settings })
      }
    }

    return this
  }

  public addKeyFramesRule(id:string, rule:string) {
    this._keyframesRules[id] = rule
  }

  private parseSelectorRule(rule:string) {
    const contents = rule.replace(/^[^\{]*\{/, '').replace(/\}[^\}]*$/, '')
    return contents.split(/\;/).map(property => property.trim()).reduce((properties, property) => {
      const [key, value] = property.split(/\s*:\s*/)
      if (key) {
        properties[key] = value
      }
      return properties
    }, {})
  }

  public addSelectorRule(id:string, rule:string) {
    const parsedRule = this.parseSelectorRule(rule)
    const existing = this._selectorRules[id]
    if (existing) {
      const parsedExisting = this.parseSelectorRule(existing)
      Object.keys(parsedRule).forEach(key => {
        parsedExisting[key] = [
          ...parsedExisting[key] ? parsedExisting[key].split((/\s*:\s*/)) : [],
          ...parsedRule[key] ? parsedRule[key].split((/\s*:\s*/)) : [],
        ].join(', ')
      }) 

      this._selectorRules[id] = `
        {
          ${Object.keys(parsedExisting)
            .map(key => `${key}: ${parsedExisting[key]};`)
            .join('')
          }
        }`

      return
    } 

    this._selectorRules[id] = rule
  }
}