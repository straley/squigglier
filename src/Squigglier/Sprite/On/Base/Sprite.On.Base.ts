
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
    const name = parentOfSvg && parentOfSvg.attributes.name

    return `
      // <![CDATA[
        document.querySelectorAll('[name="${name}"]').forEach(function(__this){
          __this.addEventListener('${this.getTagName()}', function(event) {
            ${
              this.data.replace(/(\b)this(\b)/g, '$1__this$2')
            }
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
