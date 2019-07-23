import { Entity } from '../../Entity/Entity'

export abstract class Animation extends Entity {
  public attributes: Entity.Attributes
  
  
  constructor(
    parent: Entity,
    src: string,
    attributesOrElement: Entity.Attributes | Element,
    defaultAttributes?: any
  ) {
    super(parent, src, attributesOrElement, defaultAttributes)
    this.shouldRender = false
  }
}

export namespace Animation {
  export type Attributes = Entity.Attributes & {
    await?: boolean
    limit?: Array<string>
    exclude?: Array<string>
    duration?: number
  }   
  
  
}