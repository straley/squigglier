import { Collection } from './Collection'
import { Entity } from '../Entity/Entity'
import { Sprite } from '../Sprite/Sprite'

export class Animations extends Collection {
  static tagName = 'animations'
  attributes: Collection.Attributes
  
  constructor (
    parent: Entity,
    src: string,
    attributesOrElement: Collection.Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ Sprite.Animation.Freehand ])
    this.shouldRender = false

    console.log('HAPPY BIRTHDAY', this.className)
  }
}



