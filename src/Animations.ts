import { Animate, AnimationSettings } from './Animate'

import { Freehand } from './Animations/Freehand'
import { FillIn } from './Animations/FillIn'

export type GeoMeta = {
  totalGeoLength: number,
  totalDrawableGeoLength: number,
  totalDelay: number,
  geoData: {
    [index: string]: {
      geo?: SVGGeometryElement,
      drawable: boolean,
      length: number,
      duration: number,
      delay: number
    }
  }
}

export class Animations {

  static NONDRAWABLE_DURATION = 0.5

  // usable animations 
  static freehand = Freehand.render
  static fillin = FillIn.render

  // todo:getPointsFromGeos
  // https://github.com/colinmeinke/svg-points/blob/master/src/toPoints.js


  // expands delimited (usually comma or semicolon) list of keys or key
  // value pairs (colon-separated)
  static expandSettingValue(value:string, delimiter:string|RegExp) {
    return value 
    ? value.split(delimiter).reduce((obj, pair)  => {
      const parts = pair.split(/:/)
      obj[parts[0]] = parts.length > 1 ? parts[1] : true
      return obj
    }, {})
    : {}   
  }

  // given an svg element, styles and rules (expanded with expandSettingValue), 
  // and a condition check callback, this will determine if the element should
  // be ignored
  static checkIgnore(
    element:SVGElement, 
    styles: any,
    rules:{[name:string]: any}, 
    condition:(ruleValue:any, attributeValue:any)=>boolean
  ) {
    for (const rule in rules) {
      const attr = element.getAttribute(rule) || styles[rule]
      const ignore = condition(rules[rule], attr)
      if (ignore) {
        return true
      }
    }
    return false
  }

  // given an SVGElement, all of the rules (limits, excludes, etc.), and settings
  // provide a set of geometries
  static applyValidGeometries(
    element: SVGSVGElement, 
    settings: AnimationSettings={}
  ):{
    [index: string]: SVGGeometryElement
  } {
    const svgAttributes = Animate.inspectSvg(element)
    const geos = {}
    const limits = Animations.expandSettingValue(settings.limit, /[\,\&]/)
    const excludes = Animations.expandSettingValue(settings.exclude, /[\,\&]/)

    for (const index in svgAttributes.geos) {
      const geo = svgAttributes.geos[index]

      const styles = Animations.expandSettingValue(geo.getAttribute('style'), /\s*;\s*/)

      if(!(
        Animations.checkIgnore(
          geo, 
          styles, 
          limits,
          (ruleValue, attributeValue) =>
            (ruleValue !== ( typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue ))
        ) ||
        Animations.checkIgnore(
          geo, 
          styles, 
          excludes,
          (ruleValue, attributeValue) =>
            (ruleValue === ( typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue ))
        )
      )) {
        geos[index] = geo
      }
    }

    return geos
  }

  // given a set of geometries, build metadata for rendering 
  static geometriesToGeoMeta(
    geometries: { 
      [index: string]: SVGGeometryElement
    },
    minLength: number,
    targetDuration: number,
  ): GeoMeta {
    const meta: GeoMeta = Object.keys(geometries).reduce(
      (info, index) => {

        const geo = geometries[index]
        const length = geo.getTotalLength()
        const drawable = length >= minLength

        const totalDrawableGeoLength = drawable 
          ? info.totalDrawableGeoLength + length
          : info.totalDrawableGeoLength

        const totalGeoLength = info.totalGeoLength + length
        const duration = drawable 
          ? (length / totalDrawableGeoLength) * targetDuration 
          : Animations.NONDRAWABLE_DURATION
        
        const geoData = {
          ...info.geoData,
          [index]: {
            ... info.geoData[index] || {},
            geo,
            length,
            drawable,
            duration
          }
        }

        return {
          totalDrawableGeoLength,
          totalGeoLength,
          totalDelay: 0,
          geoData,
        }
      }, 
      { 
        totalGeoLength: 0, 
        totalDrawableGeoLength: 0, 
        totalDelay: 0,
        geoData: {}
      }
    )

    const { geoData } = meta

    // determine adjustment to durations based upon number of drawable geos
    const totalDurations = Object.keys(geoData)
      .reduce((duration:number, index:string) => duration + geoData[index].duration, 0)

    const durationAdjustment = targetDuration / totalDurations

    // determine timing of each geo
    // todo: this is for sequential
    
    Object.keys(geoData)
    .sort((a, b) => geoData[a].length > geoData[b].length ? -1 : 1)
    .forEach(index => {
      const data = geoData[index]
      data.duration *= durationAdjustment
      data.delay = meta.totalDelay 
      meta.totalDelay += data.duration
    })
  
    return meta
  } 

  static withStyleSheet(callback: (CSSStyleSheet)=>void) {
    const styleSheet:CSSStyleSheet = ( document.styleSheets && document.styleSheets[0] ) as CSSStyleSheet
    if (styleSheet) {
      callback(styleSheet)
    }
  }

  static defaultFloat(value:any, defaultValue:number) {
    return typeof value !== 'undefined' && value !== null && parseFloat(value) 
      ? parseFloat(value) 
      : defaultValue     
  }

  static addElement(
    parent: HTMLElement, 
    html: string, 
    position?: InsertPosition
  ) {
    const template = document.createElement('template')
    template.innerHTML = html

    if (!position) {
      parent.append(template.content)
      return
    }

    parent.insertAdjacentElement('afterbegin', template.content.firstElementChild)
  }
}