import { 
  Attributes as _Attributes,
  Collection as _Collection,
} from '../../Entity.Collection'

import { On } from './Entity.Sprite.On';

export type Attributes = _Attributes & {
  children?: Array<On>
}

export class Collection extends _Collection {
  static tagName = 'on'
  attributes: Attributes
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ On ])
  }
}
