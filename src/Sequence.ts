import { Animations } from './Animations'
import { CommandSettings } from './Loader'
import { SVGStyle, SVGCSSRules } from './SVGStyle'

export type SequenceAction = {
  command: string,
  settings: any
}

export type SequenceActions = Array<SequenceAction>

export type SequenceThen = () => void

export class Sequence {
  private actions: SequenceActions = []
  private _index:number = 0
  private _element: SVGSVGElement
  private actionSettings: any = {}
  private finalAction?: SequenceThen
  private _style: SVGStyle

  constructor(
    element: SVGSVGElement
  ) {
    this._element = element
    this._style = new SVGStyle(this._element, this)
  }

  public element() {
    return this._element
  }

  public index() {
    return this._index
  }

  public style() {
    return this._style
  }

  public static attach(element: SVGSVGElement) {
    return new Sequence(element)
  }

  public settings(actionSettings: any = {}) {
    this.actionSettings = actionSettings    
  }

  public run() {
    this._index++

    if (this.actions.length === 0) {

      this._style.render()

      if (typeof this.finalAction === 'function') {
        this.finalAction()
      }
    }

    const action = this.actions.shift()
    if (!action) {
      return this
    }

    const { command, settings } = action

    Object.keys(this.actionSettings).forEach(index => {
      if (typeof settings[index] === 'undefined') {
        settings[index] = this.actionSettings[index].toString()
        return this
      }

      // add numbers as numbers
      if (!isNaN(settings[index]) && !isNaN(this.actionSettings[index])) {
        settings[index] = (parseFloat(settings[index]) + parseFloat(this.actionSettings[index])).toString()
      }
    })

    Animations[command](settings, this)

    return this
  }

  public finally(finalAction: SequenceThen) {
    this.finalAction = finalAction

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


}