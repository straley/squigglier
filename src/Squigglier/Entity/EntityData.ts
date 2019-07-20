import { Entity } from './Entity'

export class EntityData extends Entity {
  data: string

  constructor(
    attributesOrElement: any,
  ) {
    super (attributesOrElement)
    this.mapElementData()
  }

  protected mapElementData () {
    if (!this.element) {
      return
    }

    this.data  = this.element.textContent
  }
}

