import { Animations } from './Animations'
import { Filters } from './Filters'
import { Sequence } from './Sequence';

export type Settings = {
  [name:string]: string | boolean
}

export type CommandSettings = {
  command: string, 
  settings: Settings
} 

export class Loader {

  constructor(elements: HTMLCollectionOf<SVGSVGElement>) {
    for (const index in elements) {
      this.loadSrc(elements[index])
    }
  }

  private loadObject(src:string, callback:(object:HTMLElement)=>void) {
    const loader = new XMLHttpRequest()
    loader.open('GET', src, true)
    loader.send()
    loader.onload = function() { callback(loader.responseXML.firstChild as HTMLElement) }
  }
  
  private parseSettings(
    setting:string
  ): CommandSettings {
    const parts = setting.split(/\s+/)

    const command = parts.shift()
    const settings = {}
    for (const setting of parts) {
      const [key, val] = setting.split(/=/)
      settings[key] = typeof val !== 'undefined' ? val : true
    }
  
    return {command, settings}
  } 

  private loadSrc(target:SVGSVGElement) {
    if (!target.getAttribute && Array.isArray(target)) {
      target = target[0]
    } 
    const src = typeof target.getAttribute === 'function' && target.getAttribute('src') 
    if (!src) {
      return
    }
  
    this.loadObject(src, object => {
      const attributes = object.attributes
      // let onload = null
      const animations: Array<CommandSettings> = []
      const filters: Array<CommandSettings> = []
  
      for (const key of Object.keys(target.attributes)) {
        const attr = target.attributes[key]
        if (! attributes.hasOwnProperty(attr.name)) {
          switch(attr.name) {
            // case 'onload': 
            //   onload = attr.value
            //   break
  
            case 'animation':
              attr.value.split(/\s*;\s*/).forEach((value:string) => animations.push(this.parseSettings(value)))
              break
  
            case 'filter':
              attr.value.split(/\s*;\s*/).forEach((value:string) => filters.push(this.parseSettings(value)))
              break
          }
  
          object.setAttribute(attr.name, attr.value)
        }
      }
  
      for (const filter of filters) {
        const {command, settings} = filter
        if (typeof Filters[command] === 'function') {
          Filters[command](object, settings)
        }
      }

      if (! (object instanceof SVGSVGElement)) {
        return
      }

      (new Sequence(object, target))
        .addActions(animations)
        .nextAction()
    })
  }
}

