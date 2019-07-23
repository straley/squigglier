import { Collection, } from './Collection'
import { Entity } from '../Entity/Entity'
import { Sprite } from '../Sprite/Sprite'

export type Attributes = Collection.Attributes & {
  children?: Array<Sprite.Animation>
}

export class Animations extends Collection {
  static tagName = 'animations'
  attributes: Attributes
  
  constructor (
    parent: Entity,
    src: string,
    attributesOrElement: Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ Sprite.Animation ])
    this.shouldRender = false
  }
}



