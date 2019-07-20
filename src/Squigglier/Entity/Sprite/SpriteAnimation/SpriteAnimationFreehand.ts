import { Entity } from '../../Entity'
import { Attributes as SpriteAnimationAttributes } from './SpriteAnimation'

export type Attributes = SpriteAnimationAttributes & {
  width: number
  minLength: number
}

export class Freehand extends Entity {
  static tagName = 'freehand'
  attributes: Attributes
  
  constructor(
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, {
      width: 20,
      minLength: 50
    })
  }

}




