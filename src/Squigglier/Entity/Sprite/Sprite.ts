import { EntityCollection } from '../EntityCollection'
import { Collection } from './SpriteAnimation/SpriteAnimationCollection';
import { Freehand } from './SpriteAnimation/SpriteAnimationFreehand';
import { EntityAttibutesTypes } from '../Entity';
import { SpriteOn } from './SpriteOn/SpriteOn';

import Animation from './SpriteAnimation/SpriteAnimation' 

export default {
  Animation
}

export namespace Sprite {
  export type Attributes = EntityAttibutesTypes & {}
}

export class Sprite extends EntityCollection {
  public static tagName = 'sprite'
  
  constructor (
    attributesOrElement: Sprite.Attributes | Element
  ) {
    super(attributesOrElement, [ Collection, SpriteOn ])
  }
}

export namespace Sprite.Animation {
  Collection: Collection
  
}

