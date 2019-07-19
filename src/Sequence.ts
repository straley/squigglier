import { Animations } from './Animations'
import { Actions, SpriteEvents } from './SpriteLoader'
import { SVGStyle } from './SVGStyle'

export type SequenceItem = {
  action: string,
  settings: any
}

export type SequenceItems = Array<SequenceItem>

export type FinalSequenceCallback = () => void

export class Sequence {
  private sequenceItems: SequenceItems = []
  private _index:number = 0
  private _element: SVGElement
  private actionSettings: any = {}
  private finalSequenceItem?: FinalSequenceCallback
  private _style: SVGStyle

  constructor(
    element: SVGElement
  ) {
    this._element = element
    this._style = new SVGStyle(this._element)
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

  public static attach(element: SVGElement) {
    return new Sequence(element)
  }

  public settings(actionSettings: any = {}) {
    this.actionSettings = actionSettings    
  }

  public run() {
    this._index++

    if (this.sequenceItems.length === 0) {

      this._style.render()

      if (typeof this.finalSequenceItem === 'function') {
        this.finalSequenceItem()
      }
    }

    const sequenceItem = this.sequenceItems.shift()
    if (!sequenceItem) {
      return this
    }

    const { action, settings } = sequenceItem

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

    Animations[action](settings, this)

    return this
  }

  public finally(finalSequenceItem: FinalSequenceCallback) {
    this.finalSequenceItem = finalSequenceItem

    return this
  }

  public addActions(actions: Actions) {
    for (const animation of actions.animations) {
      const {action, settings} = animation
      if (typeof Animations[action] === 'function') {
        this.sequenceItems.push({ action, settings })
      }
    }

    return this
  }
}