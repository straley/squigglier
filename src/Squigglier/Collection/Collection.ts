import { Entity as _Entity } from '../Entity/Entity'
import { Sprite } from '../Sprite/Sprite'

export type Children = Array<_Entity | Collection>

class _CollectionChildClasses extends _Entity {
  public static Entity = _Entity
}

export abstract class Collection extends _CollectionChildClasses {
  private allowedChildren?: Array<any>
  public children: Children
  public shouldRenderChildren: boolean
  protected element?: Element

  constructor (
    parent: _Entity,
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
  export type Attributes = _Entity.Attributes & {}

  export namespace Animations {
    export type Attributes = Collection.Attributes & {
      children?: Array<Sprite.Animation>
    }
  }
  
  export type Entity = _Entity
}
