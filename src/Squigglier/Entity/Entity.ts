import { Collection } from '../Collection/Collection'

export abstract class Entity {
  public className: string
  static tagName: string
  public renderTag: string
  public shouldRender: boolean
  public attributes: Entity.Attributes
  protected element?: Element

  constructor (
    attributesOrElement: any,
    defaultAttributes?: any
  ) {
    if (defaultAttributes) {
      this.attributes = {
        ...this.attributes,
        ...defaultAttributes
      }
    }

    this.shouldRender = true
    this.className = this.constructor.name
    this.element = attributesOrElement
    if (typeof this.element === 'object' && 'tagName' in this.element) {
      this.renderTag = this.element.tagName
    }
    this.mapElementAttributes()
  } 

  protected getTagName () {
    return (this.constructor as any)['tagName']
  }

  protected mapElementAttributes () {
    if (!this.element) {
      return
    }

    this.attributes = this.element.getAttributeNames().reduce(
      (
        attributes: { [index: string]: any }, 
        index: string
      ) => {
        attributes[index] = this.element.getAttribute(index) 
        return attributes
      }, 
      this.attributes || {}
    )
  }

  protected safeAttribute(key:string, value:string) {
    key = key.replace(/[^A-Za-z_\-]/g, '')
    value = value
      .replace(/&/g, '&amp;') 
      .replace(/'/g, '&apos;') 
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')   
      
    return `${key}="${value}"`
  }

  protected renderContents() {
    return ''
  }

  public render () {
    if (
      !this.shouldRender && 
      (
        !(this instanceof Collection) ||
        !this.shouldRenderChildren
      )
    ) {
      return ''
    }

    const tagName = this.renderTag || 'div'
    
    // todo: there's gotta be a better way to seriailize the attributes
    const attributesToObject = JSON.parse(JSON.stringify(this.attributes))

    const attributes = Object.keys(attributesToObject).map(
      (key:string) => this.safeAttribute(key, attributesToObject[key])
    ).join(' ')

    const contents = this.renderContents().trim()

    // so, if we shouldn't render (but it's a collection and we shouldRenderChildren),
    // then render contents
    if (!this.shouldRender) {
      return contents
    }

    // otherwise, render the tag and the contents
    return `<${
      this.renderTag
    }${
      attributes ? ` ${attributes}` : ''
    }>${
      contents ? `\n${contents}\n` : ''
    }</${
      this.renderTag
    }>` 
  }
}

export namespace Entity {
  export type Attributes = {
    className?: string
    name?: string
    src?: string
  }
}