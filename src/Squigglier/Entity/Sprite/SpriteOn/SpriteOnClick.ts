import { SpriteOnAttributeTypes } from './SpriteOn'
import { EntityData } from '../../EntityData'

export namespace SpriteOnClick {
  export type Attributes = SpriteOnAttributeTypes & {
    width: number
    minLength: number
  }
}

export class SpriteOnClick extends EntityData {
  static tagName = 'click'
  attributes: SpriteOnClick.Attributes
  
  constructor(
    attributesOrElement: SpriteOnClick.Attributes | Element
  ) {
    super(attributesOrElement)
  }
}