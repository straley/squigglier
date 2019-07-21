// base class
import { Data } from '../../../Entity/Entity.Data'
export abstract class Base extends Data {
  constructor(attributesOrElement: any, defaultAttributes?: any) {
    super(attributesOrElement, defaultAttributes)
    this.renderTag = 'script'
  }

  renderContents () {
    return `
      // <![CDATA[
        this.addEventListener('${this.getTagName()}', function(e) {
          ${this.data}
        })
      // ]]>
    `
  }
}

// export types
export namespace Base {
  export type Attributes = Data.Attributes & {}
}
