import { Collection } from './Collection'
import { Entity } from '../Entity/Entity'
import { Sprite } from '../Sprite/Sprite'

export type Attributes = Collection.Attributes & {
  children?: Array<Sprite>
}

export class Sprites extends Collection {
  static tagName = 'on'
  attributes: Attributes
  
  constructor (
    parent: Entity,
    src: string,
    attributesOrElement: Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ Sprite ])
  }
}
