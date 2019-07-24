// base class
import { Collection } from '../Collection/Collection'

// for exporting
import { Filter as _Filter } from './Filter/Sprite.Filter'
import { On as _On } from './On/Sprite.On'
import { Animation as _Animation } from './Animation/Sprite.Animation'
// import { Base as _AnimationBase } from './Animation/Base/Sprite.Animation.Base'
import { Freehand as _Freehand } from './Animation/Sprite.Animation.Freehand'

// export nested classes
class _SpriteChildClasses extends Collection {
  public static Filter = _Filter
  public static Animation = _Animation
  public static On = _On
}

// allowed children
import { Animations } from '../Collection/Collection.Animations'
import { Ons } from '../Collection/Collection.Ons'

export class Sprite extends _SpriteChildClasses {
  static tagName = 'sprite'

  constructor (
    parent: Sprite.Entity,
    src: string,
    attributesOrElement: Sprite.Attributes | Element
  ) {
    super(parent, src, attributesOrElement, [ Animations, Ons ])
    this.renderTag = 'svg'
  }
}

// export nested types
export namespace Sprite {

  export namespace Entity {
    export type Attributes = {
      className?: string
      name?: string
      src?: string
    }
  }

  // export namespace Animation {
    // export type Base = _AnimationBase

    // export namespace Base {
    //   export type Attributes = Entity.Attributes & {
    //     await?: boolean
    //     limit?: Array<string>
    //     exclude?: Array<string>
    //     duration?: number
    //   }
    // }

    // export namespace Freehand {
    //   export type Attributes = Animation.Base.Attributes & {
    //     width: number
    //     minLength: number
    //   }
    // }    

    // export type Freehand = _Freehand   
  // }

  export type Filter = _Filter
  export type Animation = _Animation 
  export type Entity = Collection.Entity   
  export type On = _On
  export type Attributes = Collection.Attributes & {}
} 


