import { SpriteFilter } from './SpriteFilter'
import { SpriteOn } from './SpriteOn'
import { SpriteAnimations } from './SpriteAnimations';

export type SpriteAttributes = {
  tagName: 'sprite',
  name?: string
  src?: string
  children: Array<SpriteAnimations>
  [index:string]: number|string|boolean|Array<any>
  // filters?: Array<SpriteFilter>
  // ons?: Array<SpriteOn>
}

export class Sprite {
  attributes: SpriteAttributes 
  
  constructor(attributes: SpriteAttributes) {
    this.attributes = attributes
  }
}