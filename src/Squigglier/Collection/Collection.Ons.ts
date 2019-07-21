// base class
import { Collection } from './Collection'
import { On } from '../Sprite/On/Sprite.On'

export type Attributes = Collection.Attributes & {
  children?: Array<On>
}

export class Ons extends Collection {
  static tagName = 'on'
  attributes: Attributes
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ On.Click ])
  }
}
