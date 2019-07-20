
export type EntityAttibutesTypes = {
  className?: string
  name?: string
  src?: string
}

export abstract class Entity {
  public className: string
  public attributes: EntityAttibutesTypes
  protected element?: Element

  constructor (
    attributesOrElement: any,
    defaultAttributes?: any
  ) {
    if (defaultAttributes) {
      this.attributes = {
        ...this.attributes,
        ...defaultAttributes
      }
    }

    this.className = this.constructor.name
    this.element = attributesOrElement
    this.mapElementAttributes()
  } 

  protected mapElementAttributes () {
    if (!this.element) {
      return
    }

    this.attributes = this.element.getAttributeNames().reduce(
      (
        attributes: { [index: string]: any }, 
        index: string
      ) => {
        attributes[index] = this.element.getAttribute(index) 
        return attributes
      }, 
      this.attributes || {}
    )
  }
}

