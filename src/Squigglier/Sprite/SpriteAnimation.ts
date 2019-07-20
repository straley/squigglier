export type SpriteAnimationAttributes = {
  tagName: string,
  name?: string
  src?: string
  await?: boolean
  limit?: Array<string>
  exclude?: Array<string>
  duration?: number
  [index:string]: number|string|boolean|Array<any>
}

export class SpriteAnimation {
  attributes: SpriteAnimationAttributes 
  
  constructor(
    attributes: SpriteAnimationAttributes
  ) {
    this.attributes = attributes
  }
}
