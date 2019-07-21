// base class

console.log('Sprite.On.Click.1')

import { Base } from './Base/Sprite.On.Base'
console.log("BASE", Base)

console.log('Sprite.On.Click.2')

export class Click extends Base {
  static tagName = 'click'
  attributes: Click.Attributes
}

console.log('Sprite.On.Click.3')

// export types
export namespace Click {
  export type Attributes = Base.Attributes & {
    width: number
    minLength: number
  }  
}

console.log('Sprite.On.Click.4')
