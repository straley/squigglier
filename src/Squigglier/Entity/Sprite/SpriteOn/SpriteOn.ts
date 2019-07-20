import { EntityAttibutesTypes } from '../../Entity'
import { EntityCollection } from '../../EntityCollection';
import { SpriteOnClick } from './SpriteOnClick';

export type SpriteOnAttributeTypes = EntityAttibutesTypes & {
  children?: Array<SpriteOn>
}

export class SpriteOn extends EntityCollection {
  static tagName = 'on'
  attributes: SpriteOnAttributeTypes
  
  constructor (
    attributesOrElement: SpriteOnAttributeTypes | Element
  ) {
    super(attributesOrElement, [ SpriteOnClick ])
  }
}
