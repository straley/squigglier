import { Filters } from './Filters'
import { Sequence } from './Sequence';

// export interface SpriteElement extends SVGElement {
// }
// declare var SpriteElement: {
//   prototype: SpriteElement;
//   new(): SpriteElement;
// };

export type Settings = {
  [name:string]: string | boolean
}

export type ActionSettings = {
  action: string, 
  settings: Settings
} 

export type Actions = {
  animations: Array<ActionSettings>,
  filters: Array<ActionSettings>
}

export class SpriteLoader {
  private sprites: Array<Sprite> = []

  constructor(subject?: any) {   
    if (subject instanceof HTMLElement) {
      // todo
      return
    }

    const container = 
      (typeof subject === 'undefined' || subject === null) 
      ? document.body
      : (
          subject instanceof Document
          ? subject.body
          : null
        )

    if (!container) {
      return
    }

    SpriteLoader.mapChildTags(container, 'sprite', (target:Element) => {
      this.sprites.push(new Sprite(target))
    })
  }

  public static eachElement(elements:NodeList|HTMLCollection, handler:(element:Element)=>void) {
    for (const index in elements) {
      if (elements.hasOwnProperty(index) && elements[index] instanceof Element) {
        handler(elements[index] as Element)
      }
    }
  }

  public static mapChildTags(parent:Element, tag:string, handler:(target:Element)=>void) {
    const elements = parent.getElementsByTagName(tag.toLowerCase())

    SpriteLoader.eachElement(elements, element => {
      if (element.tagName.toLowerCase() === tag.toLowerCase()) {
        handler(element)
      }
    })
  }
}

export type SpriteState = 'dehydrated' | 'hydrating' | 'hydrated' | 'error'

export type SpriteEvents = {
  [name:string]: string
}

class Sprite {
  public static SPRITE_EVENTS = [
    'onbegin', 'onend', 'onrepeat', 'onabort', 'onerror', 'onresize', 'onscroll', 'onunload',
    'oncopy', 'oncut', 'onpaste', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 
    'onclick', 'onclose', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 
    'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 
    'onemptied', 'onended', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 
    'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 
    'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 
    'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 
    'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onstalled', 
    'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 
    'onactivate', 'onfocusin', 'onfocusout'
  ]

  private _state: SpriteState = 'dehydrated' 
  private target: Element
  private loaded: SVGElement
  private actions: Actions = {
    animations: [],
    filters: []
  }
  private events: SpriteEvents = {}

  constructor(target: Element) {
    this.loadSource(target)
  }

  private loadSource(target: Element) {
    if (!target.getAttribute && Array.isArray(target)) {
      target = target[0]
    } 

    this.target = target

    const src = target.getAttribute('src') 
    if (!src) {
      return
    }

    this.loadObject(src)
  }

  private loadObject(src:string) {
    const loader = new XMLHttpRequest()
    loader.open('GET', src, true)
    loader.send()
    loader.onload = (event: ProgressEvent) => {
      const element = loader.responseXML.firstChild 
      if (element instanceof SVGElement) {
        this.loaded = element
        this._state = 'hydrating'
        this.hydrate()
      } else {
        this._state = 'error'
      }
    }
  }
  
  private hydrate() {
    if (! (this.loaded instanceof SVGSVGElement)) {
      this._state = 'error'
      return
    }

    this.attributesToActions() 
    this.scriptsToEvents()

    // filters change things before we even start animating
    // so they'll get baked in    
    for (const filter of this.actions.filters) {
      const {action, settings} = filter
      if (typeof Filters[action] === 'function') {
        Filters[action](this.loaded, settings)
      }
    }

    this.compileSequence(() => {
      // this.assets[this.loaded.getAttribute('id')] = this.loaded.outerHTML   
      this.target.outerHTML = this.loaded.outerHTML
      console.log('HERE', this.target.getElementsByClassName('script'))
      this.addEvents(this.target)
      console.log('AFTER', this.target.getElementsByClassName('script'))
    })
  }

  private addEvents(element: Element) {
    if (Object.keys(this.events).length === 0) {
      return
    }

    const script = document.createElementNS(element.getAttribute('xmlns'), 'script')
    script.setAttribute('type', 'text/javascript')

    const handlers = []

    for (const name in this.events) {
      handlers.push(`
        this.addEventListener('${name.replace(/^on/, '')}',
          function(e) {
            ${this.events[name]}
          }
        )
      `)
    }

    console.log('3', script)

    element.appendChild(script)
    console.log(element)

  }


  private attributesToActions() {
    for (const key of Object.keys(this.target.attributes)) {
      const attr = this.target.attributes[key]
      if (! this.loaded.attributes.hasOwnProperty(attr.name)) {
        switch(attr.name) {
          case 'animation':
            attr.value
              .split(/\s*;\s*/)
              .forEach(
                (value:string) => this.actions.animations.push(this.parseSettings(value))
              )
            break

          case 'filter':
            attr.value
              .split(/\s*;\s*/)
              .forEach(
                (value:string) => this.actions.filters.push(this.parseSettings(value))
              )
            break
        }

        this.loaded.setAttribute(attr.name, attr.value)
      }
      // this.loaded.setAttribute(attr.name, attr.value)
    }
  }

  private parseSettings(
    setting:string
  ): ActionSettings {
    const parts = setting.split(/\s+/)

    const action = parts.shift()
    const settings = {}
    for (const setting of parts) {
      const [key, val] = setting.split(/=/)
      settings[key] = typeof val !== 'undefined' ? val : true
    }
  
    return {action, settings}
  }
  
  private addEventHandler(name, body) {
    this.events[name] = `\n${body}\n`
  }

  private scriptsToEvents() {
    SpriteLoader.mapChildTags(this.target, 'events', (events:Element) => {
      console.log('events', events)
      SpriteLoader.eachElement(events.childNodes, event => {
        if (Sprite.SPRITE_EVENTS.indexOf(event.tagName.toLowerCase()) !== -1) {
          this.addEventHandler(event.tagName.toLowerCase(), event.innerHTML)
        } 
      })
    })
  }

  private compileSequence(callback:()=>void) {
    Sequence
      .attach(this.loaded)
      .addActions(this.actions)
      .finally(callback)
      .run()     
  }



  public state() {
    return this._state
  }
}