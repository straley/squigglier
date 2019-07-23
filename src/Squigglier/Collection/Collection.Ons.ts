// base class
import { Collection } from './Collection'
import { Entity } from '../Entity/Entity'
import { On } from '../Sprite/On/Sprite.On'

export type Attributes = Collection.Attributes & {
  children?: Array<On>
}

export class Ons extends Collection {
  static tagName = 'on'
  attributes: Attributes
  
  constructor (
    parent: Entity,
    src: string,
    attributesOrElement: Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ On.Click, On.MouseEnter ])
    this.shouldRender = false
  }
}
