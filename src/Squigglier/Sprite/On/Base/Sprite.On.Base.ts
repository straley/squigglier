// base class
import { Data } from '../../../Entity/Entity.Data'
export abstract class Base extends Data {}

// export types
export namespace Base {
  export type Attributes = Data.Attributes & {}     
}
