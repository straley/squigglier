// for exporting
import { Click as _Click } from './Sprite.On.Click'
import { MouseEnter as _MouseEnter } from './Sprite.On.MouseEnter'

export class On {
  public static Click = _Click
  public static MouseEnter = _MouseEnter  
}

// export nested types
export namespace On {
  export type Click = _Click
  export type MouseEnter = _MouseEnter
}
