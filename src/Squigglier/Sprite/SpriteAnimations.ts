import { SpriteAnimation } from "./SpriteAnimation";

export type SpriteAnimationsAttributes = {
  tagName: 'animations',
  name?: string
  src?: string
  children: Array<SpriteAnimation>
  [index:string]: number|string|boolean|Array<any>
}

export class SpriteAnimations {
  attributes: SpriteAnimationsAttributes 
  
  constructor (
    attributes: SpriteAnimationsAttributes
  ) {
    this.attributes = attributes
  }
}
