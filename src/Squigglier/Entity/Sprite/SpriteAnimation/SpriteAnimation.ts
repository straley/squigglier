import { Entity, EntityAttibutesTypes } from '../../Entity'

export type Attributes = EntityAttibutesTypes & {
  await?: boolean
  limit?: Array<string>
  exclude?: Array<string>
  duration?: number
}   

export abstract class Animation extends Entity {
  attributes: Attributes
  
  constructor(
    attributesOrElement:Attributes | Element
  ) {
    super(attributesOrElement)
  }
}

