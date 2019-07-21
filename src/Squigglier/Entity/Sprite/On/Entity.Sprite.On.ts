import { 
  EntityData, 
  Attributes as BaseAttributes 
} from '../../Entity.Data'

export type Attributes = BaseAttributes & {
}   

export abstract class On extends EntityData {
  attributes: Attributes
  
  constructor(
    attributesOrElement:Attributes | Element
  ) {
    super(attributesOrElement)
  }
}

