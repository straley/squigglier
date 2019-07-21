// base class

import { Base } from './Base/Sprite.On.Base'

export class MouseEnter extends Base {
  static tagName = 'mouseenter'
  attributes: MouseEnter.Attributes
}

// export types
export namespace MouseEnter {
  export type Attributes = Base.Attributes & {}  
}
