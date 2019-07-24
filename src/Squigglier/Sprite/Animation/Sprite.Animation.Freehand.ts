import { Sprite } from '../Sprite'
import { Base } from '../Animation/Base/Sprite.Animation.Base'

export type Attributes =  Base & {
  width: number
  minLength: number
}


export class Freehand extends Base {
  static tagName = 'freehand'
  attributes: Attributes
  
  constructor(
    parent: Sprite.Entity,
    src: string,
    attributesOrElement: Attributes | Element
  ) {
    super(parent, src, attributesOrElement, {
      width: 20,
      minLength: 50
    })
    this.renderTag = 'style'
    this.shouldRender = true

    console.log('Me??')

  }

  renderContents () {
    console.log('HERE')
    // const parentOfSvg = this.getParentOfClass(Sprite) 
    // const name = parentOfSvg && parentOfSvg.attributes.name

    return `
      @keyframes red-panda-1-0-opacity {
        from {opacity: 0; }
        to {opacity: 0; }
      }
    `
  }

}



