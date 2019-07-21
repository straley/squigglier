// for exporting

console.log('Sprite.On.1')

import { Click as _Click } from './Sprite.On.Click'

console.log('Sprite.On.2')

export class On {
  public static Click = _Click
}

console.log('Sprite.On.3')

// export nested types
export namespace On {
  export type Click = _Click
}

console.log('Sprite.On.4')

