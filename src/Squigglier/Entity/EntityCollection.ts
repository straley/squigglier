import { Entity } from './Entity'

export type EntityChildren = Array<Entity | EntityCollection>

export class EntityCollection extends Entity {
  private allowedChildren?: Array<any>
  children: EntityChildren

  constructor (
    attributesOrElement: any,
    allowedChildren: Array<any>
  ) {
    super(attributesOrElement)
    this.allowedChildren = allowedChildren
    this.mapElementChildren()
  }

  private elementToClassReference (
    element: Element
  ) {
    if (!this.allowedChildren) {
      return
    }

    if (!element.tagName) {
      return
    }

    const classReference = this.allowedChildren.find(child => child.tagName === element.tagName.toLowerCase())
    if (!classReference) {
      return
    }

    const childClass: typeof classReference = classReference    
    return childClass
  }

  protected mapElementChildren () {
    if (!this.element) {
      return
    }

    this.children = []

    for (const child of this.element.children) {
      const reference = this.elementToClassReference(child)
      if(!reference) {
        continue
      }
      this.children.push(new reference(child))
    }
  }
}

