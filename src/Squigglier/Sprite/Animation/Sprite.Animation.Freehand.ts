import { Animation  } from './Sprite.Animation'
import { Entity } from '../../Entity/Entity'

export class Freehand extends Animation {
  static tagName = 'freehand'
  attributes: Freehand.Attributes
  
  constructor(
    parent: Entity,
    src: string,
    attributesOrElement: Freehand.Attributes | Element
  ) {
    super(parent, src, attributesOrElement, {
      width: 20,
      minLength: 50
    })
  }
}

export namespace Freehand {
  export type Attributes = Animation.Attributes & {
    width: number
    minLength: number
  }
}


