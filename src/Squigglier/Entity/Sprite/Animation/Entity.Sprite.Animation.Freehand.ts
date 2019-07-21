import { Entity as _Entity } from '../../Entity'
import { Attributes as _Attributes  } from './Entity.Sprite.Animation'

export type Attributes = _Attributes & {
  width: number
  minLength: number
}

export class Freehand extends _Entity {
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




