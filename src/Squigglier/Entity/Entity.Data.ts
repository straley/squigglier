// base class
import { Entity } from './Entity'

export abstract class Data extends Entity {
  data: string

  constructor(
    parent: Entity,
    src: string,
    attributesOrElement: any,
    defaultAttributes?: any
  ) {
    super(parent, src, attributesOrElement, defaultAttributes)
    this.mapElementData()
  }

  protected mapElementData () {
    if (!this.element) {
      return
    }

    this.data  = this.element.textContent
  }
}

// export types
export namespace Data {
  export type Attributes = Entity.Attributes & {}
}