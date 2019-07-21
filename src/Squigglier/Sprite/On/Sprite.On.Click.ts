// base class

import { Base } from './Base/Sprite.On.Base'

export class Click extends Base {
  static tagName = 'click'
  attributes: Click.Attributes
}

// export types
export namespace Click {
  export type Attributes = Base.Attributes & {}  
}
