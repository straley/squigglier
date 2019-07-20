import { Animate, SVGAttributes } from './Animate'


export type AnimateFilterSettings = {
  fill?: string,
  stroke?: string,
}

export class Filters {
  static animate(element:SVGSVGElement, settings:SVGAttributes={}) {
    Animate.svgOverride(element, settings)
  }
}

