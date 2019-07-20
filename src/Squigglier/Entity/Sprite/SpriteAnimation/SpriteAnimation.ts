import { Entity, EntityAttibutesTypes } from '../../Entity'

import { Collection } from './SpriteAnimationCollection'
import { Freehand } from './SpriteAnimationFreehand'

export default {
  Collection,
  Freehand
}

export abstract class Animation extends Entity {
  attributes: Sprite.Animation.Attributes
  
  constructor(
    attributesOrElement: Sprite.Animation.Attributes | Element
  ) {
    super(attributesOrElement)
  }
}

export namespace Sprite.Animation {
  export type Attributes = EntityAttibutesTypes & {
    await?: boolean
    limit?: Array<string>
    exclude?: Array<string>
    duration?: number
  }   
}

