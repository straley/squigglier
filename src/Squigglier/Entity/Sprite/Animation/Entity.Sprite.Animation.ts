import { 
  Entity as _Entity, 
  Attributes as _Attributes 
} from '../../Entity'


import { 
  Collection as _Collection
} from './Entity.Sprite.Animation.Collection'

export type Attributes = _Attributes & {
  await?: boolean
  limit?: Array<string>
  exclude?: Array<string>
  duration?: number
}   

export abstract class Animation extends _Entity {
  public static Collection = _Collection

  public attributes: Attributes
  
  
  constructor(
    attributesOrElement:Attributes | Element
  ) {
    super(attributesOrElement)
  }
}

