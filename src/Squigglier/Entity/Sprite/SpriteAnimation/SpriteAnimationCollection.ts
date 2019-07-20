import Sprite from '../Sprite'

import { EntityAttibutesTypes } from '../../Entity'
import { EntityCollection } from '../../EntityCollection';

type _Attributes = EntityAttibutesTypes & {
  children?: Array<Animation>
}

export namespace Sprite.Animation.Collection {
  export type Attributes = _Attributes
}

export class Collection extends EntityCollection {
  static tagName = 'animations'
  attributes: _Attributes
  
  constructor (
    attributesOrElement: _Attributes | Element
  ) {
    super(attributesOrElement, [ Sprite.Animation.Freehand ])
  }
}



