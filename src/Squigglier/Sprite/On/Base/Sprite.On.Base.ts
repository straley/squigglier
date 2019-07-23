
// base class
import { Data } from '../../../Entity/Entity.Data'
import { Entity } from '../../../Entity/Entity'
import { Sprite } from '../../Sprite'

export abstract class Base extends Data {
  constructor(
    parent: Entity,
    src: string,
    attributesOrElement: any, 
    defaultAttributes?: any
  ) {
    super(parent, src, attributesOrElement, defaultAttributes)
    this.renderTag = 'script'
  }

  renderContents () {
    const parentOfSvg = this.getParentOfClass(Sprite) 
    console.log(parentOfSvg)

    return `
      // <![CDATA[
        document.querySelectorAll('[name="${this}"]').forEach(function(e){
          e.addEventListener('${this.getTagName()}', function(e) {
            ${this.data}
          })
        })
      // ]]>
    `
  }
}

// export types
export namespace Base {
  export type Attributes = Data.Attributes & {}
}
