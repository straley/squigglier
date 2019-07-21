import { Attributes as _Attributes } from '../../Entity'
import { Collection as _Collection } from '../../Entity.Collection'

export type Attributes = _Attributes & {
  children?: Array<Animation>
}

export class Collection extends _Collection {
  static tagName = 'animations'
  attributes: Attributes
  
  constructor (
    attributesOrElement: Attributes | Element
  ) {
    super(attributesOrElement, [ Collection ])
  }
}



