import { Animation  } from './Sprite.Animation'

export class Freehand extends Animation {
  static tagName = 'freehand'
  attributes: Freehand.Attributes
  
  constructor(
    attributesOrElement: Freehand.Attributes | Element
  ) {
    super(attributesOrElement, {
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


