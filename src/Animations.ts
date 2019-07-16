import { Animate, AnimationSettings } from './Animate'

export type FreehandAnimateSettings = {
  width?: number|string,
  duration?: number|string,
  minLength?: number|string,
}

export class Animations {

  // todo:getPointsFromPath
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

  // given an SVGElement, all of the rules (limits, excludes, etc.), and
  static applyValidPaths(
    element: SVGSVGElement, 
    settings: AnimationSettings={}, 
    // callback: (index: string|number, path: SVGGeometryElement) => void
  ):{[index: string]: SVGGeometryElement} {
    const svgAttributes = Animate.inspectSvg(element)
    const paths = {}
    const limits = Animations.expandSettingValue(settings.limit, /[\,\&]/)
    const excludes = Animations.expandSettingValue(settings.exclude, /[\,\&]/)

    for (const index in svgAttributes.paths) {
      const path = svgAttributes.paths[index]

      const styles = Animations.expandSettingValue(path.getAttribute('style'), /\s*;\s*/)

      if(!(
        Animations.checkIgnore(
          path, 
          styles, 
          limits,
          (ruleValue, attributeValue) =>
            (ruleValue !== ( typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue ))
        ) ||
        Animations.checkIgnore(
          path, 
          styles, 
          excludes,
          (ruleValue, attributeValue) =>
            (ruleValue === ( typeof attributeValue === 'undefined' || attributeValue === null ? 'default' : attributeValue ))
        )
      )) {
        paths[index] = path
      }
    }

    return paths
  }

  static defaultFloat(value:any, defaultValue:number) {
    return typeof value !== 'undefined' && value !== null && parseFloat(value) 
      ? parseFloat(value) 
      : defaultValue     
  }

  static freehand(element:SVGSVGElement, settings:FreehandAnimateSettings={}) {
    // values from settings
    const id = element.getAttribute('id')
    const width = this.defaultFloat(settings.width, 30)
    const duration = this.defaultFloat(settings.duration, 3)
    const minLength = this.defaultFloat(settings.minLength, 0)

    // ensure style sheet
    const styleSheet:CSSStyleSheet = ( document.styleSheets && document.styleSheets[0] ) as CSSStyleSheet
    if (!styleSheet) {
      return
    }

    // create definition block for mask paths
    const defs = document.createElement('defs')

    let maxLength = minLength

    let totalLength = 0 
    let compressedDuration = 0

    const paths = Animations.applyValidPaths(element, settings)

    Object.keys(paths).forEach(index => {
      const path = paths[index];
      const pathLength = path.getTotalLength()

      compressedDuration += Math.min(
        (pathLength / totalLength) * duration,
        duration * 0.25
      )

      if (pathLength >= minLength) {
        totalLength += pathLength
      }
    })

    const durationAdjustment = duration / compressedDuration 

    Object.keys(paths).forEach(index => {
      const path = paths[index]      
      

      const pathLength = path.getTotalLength()
      maxLength = Math.max(maxLength, pathLength)

      if (pathLength < minLength) {
        path.classList.add(`${id}-tiny-${index}`)
        return
      }

      const mask = document.createElement('mask')
      mask.setAttribute('id', `${id}-mask-${index}`)
      mask.setAttribute('maskUnits', 'userSpaceOnUse')
      
      const maskPath = document.createElement('path')
      maskPath.setAttribute('d', path.getAttribute('d'))
      maskPath.classList.add(`${id}-mask`)
      mask.append(maskPath)
      defs.append(mask)

      path.setAttribute('mask', `url(#${id}-mask-${index})`)
    })

    // add defnition block to the beginning of the element
    element.insertAdjacentElement('afterbegin', defs)

    let delay = 0

    Object
      .keys(paths)
      .sort((a, b) => paths[a].getTotalLength() > paths[b].getTotalLength() ? -1 : 1)
      .forEach(index => {
        const path = paths[index]
        const pathLength = path.getTotalLength()
        const pathDuration = pathLength >= minLength 
          ? (pathLength / totalLength) * duration * durationAdjustment
          : 0

        if (pathLength < minLength) {
          // add css keyframe for animation
          styleSheet.insertRule(`
            @keyframes ${id}-freehand-${index} {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `)

          // add css settings
          styleSheet.insertRule(`
            .${id}-tiny-${index} {
              opacity: 0;
              animation: ${id}-freehand-${index} ${pathDuration}s linear forwards;
              animation-delay: ${delay}s;
            }
          `)

          delay += pathDuration || 0.5
          return
        }  

        // add css keyframe for animation
        styleSheet.insertRule(`
          @keyframes ${id}-freehand-${index} {
            from { stroke-dashoffset: ${pathLength}; }
            to { stroke-dashoffset: 0; }
          }
        `)

        // add css mask settings
        styleSheet.insertRule(`
          #${id}-mask-${index} {
            fill: none;
            stroke: white;
            stroke-width: ${width};
            stroke-dasharray: ${pathLength} ${pathLength};
            stroke-dashoffset: ${pathLength};
            animation: ${id}-freehand-${index} ${pathDuration}s linear forwards;
            animation-delay: ${delay}s;
          }
        `)

        delay += Math.min(pathDuration, duration * 0.25) 
      }
    )

  }

  static fillin(element:SVGSVGElement, settings={}) {
    // ensure style sheet
    const styleSheet = document.styleSheets && document.styleSheets[0]
    if (!styleSheet) {
      return
    }

    const paths = this.applyValidPaths(element, settings)
    Object.keys(paths).forEach(index => {
      const path = paths[index]
      // to do -- fill this in marker style
      path.setAttribute('opacity', '0')
    })
  }
}