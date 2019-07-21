import { Attributes as _Attributes } from './Entity.Sprite.OnCollection'
import { EntityData } from '../../Entity.Data'

export type Attributes = _Attributes & {
  width: number
  minLength: number
}

export class SpriteOnClick extends EntityData {
  static tagName = 'click'
  attributes: Attributes
  
  constructor(
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement)
  }
}