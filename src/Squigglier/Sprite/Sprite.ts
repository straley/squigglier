// base class
import { Collection } from '../Collection/Collection'
import { Entity } from '../Entity/Entity'

// allowed children
import { Animations } from '../Collection/Collection.Animations'
import { Ons } from '../Collection/Collection.Ons'

// for exporting
import { Animation as _Animation } from './Animation/Sprite.Animation'
import { Filter as _Filter } from './Filter/Sprite.Filter'
import { On as _On } from './On/Sprite.On'

export class Sprite extends Collection {
  // export nested classes
  public static Animation = _Animation
  public static Filter = _Filter
  public static On = _On

  static tagName = 'sprite'

  constructor (
    parent: Entity,
    src: string,
    attributesOrElement: Sprite.Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ Animations, Ons ])
    this.renderTag = 'svg'
  }
}

// export nested types
export namespace Sprite {
  export type Animation = _Animation
  export type Filter = _Filter
  export type On = _On
  export type Attributes = Collection.Attributes & {}
}


