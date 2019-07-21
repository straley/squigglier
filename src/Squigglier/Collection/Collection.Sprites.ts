import { Collection } from './Collection'
import { Sprite } from '../Sprite/Sprite'

export type Attributes = Collection.Attributes & {
  children?: Array<Sprite>
}

export class Sprites extends Collection {
  static tagName = 'on'
  attributes: Attributes
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ Sprite ])
  }
}
