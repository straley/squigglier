import { Entity } from '../../Entity'
import { Sprite } from '../Sprite'

type _Attributes = Sprite.Animation & {
  width: number
  minLength: number
}

export namespace Animation.Freehand {
  export type Attributes = _Attributes
}

export class Freehand extends Entity {
  static tagName = 'freehand'
  attributes: _Attributes
  
  constructor(
    attributesOrElement: _Attributes | Element
  ) {
    super(attributesOrElement, {
      width: 20,
      minLength: 50
    })
  }

}




