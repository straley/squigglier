import { Entity } from '../Entity/Entity'

export type Children = Array<Entity | Collection>

export abstract class Collection extends Entity {
  private allowedChildren?: Array<any>
  public children: Children
  public shouldRenderChildren: boolean
  protected element?: Element

  constructor (
    parent: Entity,
    src: string, 
    attributesOrElement: any,
    allowedChildren: Array<any>
  ) {
    super(parent, src, attributesOrElement, allowedChildren)
    this.shouldRenderChildren = true
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
      this.children.push(new reference(this, this.src, child))
    }
  }

  protected renderContents () {
    if (!this.shouldRenderChildren) {
      return ''
    }

    return this.children.map(child => `${child.render()}`).join('\n')
  }
}

export namespace Collection {
  export type Attributes = Entity.Attributes & {}
}