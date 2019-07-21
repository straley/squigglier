import { Collection } from '../Entity.Collection'
import { Attributes as _Attributes } from '../Entity'
import { Collection as AnimationCollection } from './Animation/Entity.Sprite.Animation.Collection'
import { Collection as OnCollection } from './On/Entity.Sprite.OnCollection'

export type Attributes = _Attributes & {}

export class Sprite extends Collection {
  public static tagName = 'sprite'
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ AnimationCollection, OnCollection ])
  }
}


