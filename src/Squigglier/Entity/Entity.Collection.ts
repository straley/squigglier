import { 
  Attributes as _Attributes,
  Entity as _Entity 
} from './Entity'

export type Children = Array<_Entity | Collection>
export type Attributes = _Attributes & {}

export abstract class Collection extends _Entity {
  private allowedChildren?: Array<any>
  children: Children

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
