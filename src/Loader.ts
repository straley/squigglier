import { Animations, AnimationSequence } from './Animations'
import { Filters } from './Filters'

type Settings = {
  [name:string]: string | boolean
}

export class Loader {

  static compile(elements: HTMLCollectionOf<SVGSVGElement>) {
    for (const index in elements) {
      Loader.loadSvg(elements[index])
    }
  }

  static getNextSequenceAction(
    object: SVGSVGElement,
    target: HTMLElement,
    sequence: AnimationSequence
  ) {
    if (sequence.length === 0) {
      target.outerHTML = object.outerHTML
      return
    }

    const nextSequence = sequence.shift()
    const { element, command, settings } = nextSequence

    console.log(command, element, settings, sequence)
    Animations[command](element, settings, parent, sequence, Loader.getNextSequenceAction)
  }



  static loadXMLObject(
    src: string, 
    target: object,
    callback: (
      object: HTMLElement,
      target: object
    ) => void
  ) {
    const loader = new XMLHttpRequest()
    loader.open('GET', src, true)
    loader.send()
    loader.onload = ()=>callback(loader.responseXML.firstChild as HTMLElement, target) 
  }
  
  static parseSettings(setting:string):[string, Settings] {
    const parts = setting.split(/\s+/)

    const command = parts.shift()
    const settings = {}
    for (const setting of parts) {
      const [key, val] = setting.split(/=/)
      settings[key] = val
    }
  
    return [command, settings]
  } 

  static compileSvg(
    object: SVGSVGElement, 
    target: HTMLElement
  ) {
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
            attr.value.split(/\s*;\s*/).forEach(value => animations.push(Loader.parseSettings(value)))
            break

          case 'filter':
            attr.value.split(/\s*;\s*/).forEach(value => filters.push(Loader.parseSettings(value)))
            break
        }

        object.setAttribute(attr.name, attr.value)
      }
    }

    for (const filter of filters) {
      const [command, settings] = filter
      if (typeof Filters[command] === 'function') {
        Filters[command](object, settings)
      }
    }

    // chain sets up a sequence of actions 
    const sequence:AnimationSequence = []

    for (const animation of animations) {
      const [command, settings] = animation
      if (typeof Animations[command] === 'function') {
        sequence.push({
          element: object,
          command,
          settings,
        })
      }
    }

    // start the chain
    Loader.getNextSequenceAction(object, target, sequence)
  }

  static loadSvg(
    target: SVGSVGElement
  ) {
    if (!target.getAttribute && Array.isArray(target)) {
      target = target[0]
    } 

    const src = typeof target.getAttribute === 'function' && target.getAttribute('src') 
    if (!src) {
      return
    }
  
    this.loadXMLObject(src, target, Loader.compileSvg)
  }
}

