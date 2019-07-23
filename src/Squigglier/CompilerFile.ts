import fs from 'fs'
import path, { ParsedPath } from 'path'
import { JSDOM } from 'jsdom'
import { Sprite } from './Sprite/Sprite'
import { js_beautify } from 'js-beautify'

export const CompilerFileStatusValues = [
  'pending', 'processing', 'blocked', 'error', 'complete'
]
export type CompilerFileStatus = (typeof CompilerFileStatusValues)[number]

export type CompilerFiles = { [path: string]: CompilerFile|null }

export type StatusUpdateHandler = (
  dependant: CompilerFile,
  newStatus: CompilerFileStatus, 
  oldStatus?: CompilerFileStatus
) => void

export class CompilerFile {
  private _path: ParsedPath
  private _src: string
  private _status: CompilerFileStatus = 'pending'
  private _raw?: string
  private _html?: string
  private _dependancies: CompilerFiles = {}
  public rawDom?: JSDOM
  public dom?: JSDOM
  
  private entities: Array<any> = []
  private statusUpdateHandlers: Array<StatusUpdateHandler> = []

  constructor (src: string) {
    this._src = src
    this._path = path.parse(src)
  }

  // user getter to make readonly for others
  public get path () { return this._path }
  public get src () { return this._src }
  public get status () { return this._status }
  public get raw () { return this._raw }
  public get html () { return this._raw }
  public get dependancies ():Array<string> { return Object.keys(this._dependancies) }

  private async updateStatus (newStatus:string) {
    const oldStatus = this._status
    this._status = newStatus

    if (!this.statusUpdateHandlers) {
      return
    }

    for (const handler of this.statusUpdateHandlers) {
      if (typeof handler === 'function') {
        await handler(this, this._status, oldStatus)
      }
    }
  }

  public async updateDependant (dependant: string|CompilerFile) {
    if (!dependant) {
      return
    }
    const src = dependant instanceof CompilerFile 
      ? dependant.src
      : dependant

    this._dependancies[src] = dependant instanceof CompilerFile ? dependant : null
    await this.updateStatus('blocked')
  } 

  public async updateDeepStatus () {
    // these take priority
    if (this.status === 'error' || this.status === 'pending' || this.status === 'processing') {
      return
    }

    let status:CompilerFileStatus = null
    for (const dependant in this._dependancies) {
      if (!this._dependancies[dependant]) {
        status = 'blocked'
        break
      } 

      if (this._dependancies[dependant].status === 'error') {
        status = 'error'
      }      

      if (this._dependancies[dependant].status !== 'complete') {
        status = 'blocked'
      }      
    }

    if (!status) {
      status = 'complete'
    }
    
    // don't send an update status signal if it's already
    // been set

    if (status === this.status) {
      return
    }

    await this.updateStatus(status)
  }

  public async load () {
    await this.updateStatus('processing')

    try {
      // load the file and try to attach it to a virtual dom
      this._raw = fs.readFileSync(this._src, 'utf8')
      this.rawDom = new JSDOM(this._raw, { contentType: "image/svg+xml" })
      this.updateDomFromRaw()

      // if this is not a sprite file, it's probably an asset 
      // (i.e., svg file) needed for a sprite
      if (this.path.ext !== '.sprite') {
        await this.updateStatus('complete')
        return
      }

      await this.buildEntities(true)
    } catch (e) {
      console.log(e)
      await this.updateStatus('error')
    }
  }

  public async buildEntities (updateStatuses: boolean = false) {
    // process each sprite in the dom
    // todo: this should just be top-level sprites?
    this.entities.length = 0
      
    const elements = this.dom.window.document.querySelectorAll('sprite')
    for (const element of elements) {
      const sprite = new Sprite(null, this._src, element)
      if (sprite.attributes.src) {
        if (updateStatuses) {
          const dependantPath = path.join(path.dirname(sprite.src), sprite.attributes.src)
          await this.updateDependant(dependantPath)
        }
      }
      this.entities.push(sprite)
    }

    if (updateStatuses) {
      await this.updateDeepStatus()
    }
  }

  // produce final output
  public async render() {
    await this.pretty()
    return this._html
  }


  // produce DOM object
  public async renderEntities() {
    await this.buildEntities()

    if (this.entities.length === 0) {
      return
    }

    const renderedEntities = this.entities.map(
      entity => {
        if (
          (typeof entity !== 'object') ||
          !('render' in entity) ||
          !(typeof entity.render === 'function')
         ) {
          console.error('unprocessable entity', entity)
          return
        }

        // entities render function
        return entity.render()
      }
    ).join('\n')

    this.dom = new JSDOM(renderedEntities, { contentType: "image/svg+xml" })
    // console.log("DOM", this.src, this.dom.serialize())
  }

  // beaufity html
  private pretty () {
    const VOID_ELEMENTS = [
      'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 
      'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 
      'wbr'
    ]
    
    const html = this.dom.serialize()
    let indent = 0
    let inCdata = false
    let jscode: Array<string> = []

    this._html =  html.split(/\n/).map((line:string) => {
      if (line.match(/^\s*(\/\/\s*)?<!\[CDATA\[/)) {
        inCdata = true
        jscode = []
        return `${' '.repeat(indent)}${line.trim()}`  
      }
      
      if (inCdata && line.match(/^\s*(\/\/\s*)?\]\]>/)) {
        inCdata = false

        const pretty = js_beautify(jscode.join(''))
        return `${pretty}\n${' '.repeat(indent)}${line.trim()}`
      }

      if (inCdata) {
        // todo: don't pretty if not js
        jscode.push(line)
        return ''
      }

      const tagParts = line.match(/<\s*([\/]{0,1})\s*([a-zA-Z_\-]+)([^\>]*)([\/]{0,1})\s*>/)
      if (!tagParts) {
        return line
      }

      const [, closer, tagName, contents ] = tagParts 
      const selfClosing = !!contents.match(/\/\s*$/)
      if (closer) {
        indent = Math.max(indent - 2, 0)
        return `${' '.repeat(indent)}${line}`  
      }

      if (
        VOID_ELEMENTS.includes(tagName) ||
        closer ||
        selfClosing
      ) {
        return `${' '.repeat(indent)}${line}`  
      }

      indent += 2
      return `${' '.repeat(indent - 2)}${line}`  
    }).filter(line => line.trim() !== '').join('\n')
  }    

  public updateDomFromRaw () {
    this.dom = this.rawDom
  }

  public async overlayAttributes(
    overlay: CompilerFile, 
    overwrite: boolean = false
  ) {
    const source = await overlay.dom.window.document.firstElementChild
    const target = await this.dom.window.document.firstElementChild

    for (const attribute of source.attributes) {
      if (overwrite || !target.hasAttribute(attribute.name)) {
        await target.setAttribute(attribute.name, attribute.value)
      }  
    }  
  }

  public async overlayChildren(
    overlay: CompilerFile, 
    location: 'top'|'bottom' = 'top'
  ) {
    const source = await overlay.dom.window.document.firstElementChild
    const target = await this.dom.window.document.firstElementChild

    if (location === 'top') {
      target.innerHTML = source.innerHTML + '\n\n' + target.innerHTML
      return
    }
    target.innerHTML = target.innerHTML + '\n\n' + source.innerHTML 
  }


  public onStatusUpdate (handler: StatusUpdateHandler) {
    // register change handler
    this.statusUpdateHandlers.push(handler)
  }

  // do a full render of the file and store it in html
  public complete() {

  }
}



