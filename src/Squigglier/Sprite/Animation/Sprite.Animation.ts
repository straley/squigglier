// for exporting
import { Freehand as _Freehand } from './Sprite.Animation.Freehand'
import { Base as _Base } from './Base/Sprite.Animation.Base'

export class Animation {
  public static Freehand = _Freehand
  public static Base = _Base
}

// export nested types
export namespace Animation {
  export type Freehand = _Freehand
  export type Base = _Base
}
