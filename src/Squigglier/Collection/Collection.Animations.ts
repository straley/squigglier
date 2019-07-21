import { Collection, } from './Collection'
import { Sprite } from '../Sprite/Sprite'

export type Attributes = Collection.Attributes & {
  children?: Array<Sprite.Animation>
}

export class Animations extends Collection {
  static tagName = 'animations'
  attributes: Attributes
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ Sprite.Animation ])
  }
}



