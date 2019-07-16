import { Animations } from './Animations'
import { Filters } from './Filters'

type Settings = {
  [name:string]: string | boolean
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
  
  private parseSettings(setting:string):[string, Settings] {
    const parts = setting.split(/\s+/)

    const command = parts.shift()
    const settings = {}
    for (const setting of parts) {
      const [key, val] = setting.split(/=/)
      settings[key] = val
    }
  
    return [command, settings]
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
      const animations = []
      const filters = []
  
      for (const key of Object.keys(target.attributes)) {
        const attr = target.attributes[key]
        if (! attributes.hasOwnProperty(attr.name)) {
          switch(attr.name) {
            // case 'onload': 
            //   onload = attr.value
            //   break
  
            case 'animation':
              attr.value.split(/\s*;\s*/).forEach(value => animations.push(this.parseSettings(value)))
              break
  
            case 'filter':
              attr.value.split(/\s*;\s*/).forEach(value => filters.push(this.parseSettings(value)))
              break
          }
  
          object.setAttribute(attr.name, attr.value)
        }
      }
  
      for (const animation of animations) {
        const [command, settings] = animation
        if (typeof Animations[command] === 'function') {
          Animations[command](object, settings)
        }
      }
  
      for (const filter of filters) {
        const [command, settings] = filter
        if (typeof Filters[command] === 'function') {
          Filters[command](object, settings)
        }
      }
  
      // if (onload && window && typeof window[onload] === 'function') {
      //  window[onload](object)
      // }
  
      target.outerHTML = object.outerHTML
    })
  }
}

