// base class
import { Entity } from '../../../Entity/Entity'

// for exporting
import { Freehand as _Freehand } from '../../Animation/Sprite.Animation.Freehand'

// export nested classes
class _SpriteAnimationChildClasses extends Entity {
  public static Freehand = _Freehand
}

export abstract class Base extends _SpriteAnimationChildClasses {
  constructor(
    parent: Entity,
    src: string,
    attributesOrElement: any, 
    defaultAttributes?: any
  ) {
    super(parent, src, attributesOrElement, defaultAttributes)
    this.renderTag = 'script'

    console.log('HAPPY BIRTHDAY', this.className)

  }
}

// export types
export type Freehand = _Freehand
