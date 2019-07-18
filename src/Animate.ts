import { AnimateFilterSettings } from './Filters'
import { FreehandAnimateSettings } from './Animations/Freehand'

export type AnimationSettings = {
  limit?: string,
  exclude?: string, 
  delay?: string
} & FreehandAnimateSettings 
& AnimateFilterSettings

export type SVGAttributes = {
  fill?: string,
  stroke?: string,
}

export class Animate {
  static SVG_GEO_ELEMENTS:Array<string> = [
    'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect', 'text' 
  ]

  static svgOverride(element:SVGElement, attributes:SVGAttributes) {
    for (const name of Object.keys(attributes)) {
      element.setAttribute(name, attributes[name])
    }

    for (const index in element.childNodes) {
      const child = element.childNodes[index]
      if (child instanceof SVGElement) {
        this.svgOverride(child, attributes)
      }
    }
  }

  static inspectSvg = function(element:SVGSVGElement, results={geos:[]}) {
    if (Animate.SVG_GEO_ELEMENTS.indexOf(element.tagName) !== -1) {
      results.geos.push(element)
      return results
    } 

    if (element.tagName === 'g' || element.tagName === 'svg') {
      for (const index in element.childNodes) {
        results = this.inspectSvg(element.childNodes[index], results)
      }
    }

    return results
  }
}
