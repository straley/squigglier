import { Animate, AnimationSettings } from './Animate'

export type FreehandAnimateSettings = {
  width?: number|string,
  duration?: number|string,
  minLength?: number|string,
}

export class Animations {

  // todo:getPointsFromPath
  // https://github.com/colinmeinke/svg-points/blob/master/src/toPoints.js

  static applyValidPaths(element, settings:AnimationSettings={}, callback) {
    const svgAttributes = Animate.inspectSvg(element)
    const paths = {}

    const limits = settings.limit 
      ? settings.limit.split(/[\,\&]/).reduce((obj, pair)  => {
        const parts = pair.split(/:/)
        obj[parts[0]] = parts.length > 1 ? parts[1] : true
        return obj
      }, {})
      : {} 

    const excludes = settings.exclude 
      ? settings.exclude.split(/[\,\&]/).reduce((obj, pair)  => {
        const parts = pair.split(/:/)
        obj[parts[0]] = parts.length > 1 ? parts[1] : true
        return obj
      }, {})
      : {} 

    for (const index in svgAttributes.paths) {
      const path = svgAttributes.paths[index]

      let ignore = false

      const style = path.getAttribute('style') 
        ? path.getAttribute('style').split(/\s*;\s*/).reduce((obj, pair) => {
          const parts = pair.split(/:/)
          obj[parts[0]] = parts.length > 1 ? parts[1] : true
          return obj
        }, {})
        : {}

      for (const item in limits) {
        const attr = path.getAttribute(item) || style[item]
        if (limits[item] !== ( typeof attr === 'undefined' || attr === null ? 'default' : attr )) {
          ignore = true
          break
        }
      }

      for (const item in excludes) {
        const attr = path.getAttribute(item) || style[item]
        if (excludes[item] === ( typeof attr === 'undefined' || attr === null ? 'default' : attr )) {
          ignore = true
          break
        }
      }


      if (!ignore) {
        paths[index] = path
        if (typeof callback === 'function') {
          callback(index, path)
        }
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
    const duration = this.defaultFloat(settings.duration, 20)
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

    const paths = Animations.applyValidPaths(element, settings, function(index, path) {

      const pathLength = path.getTotalLength()

      compressedDuration += Math.min(
        parseFloat(pathLength) 
        ? (parseFloat(pathLength) / totalLength) * duration
        : 0.05,
        duration * 0.25
      )

      if (pathLength < minLength) {
        return
      }

      totalLength += pathLength
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
        const pathDuration = pathLength < minLength  
          ? 0 
          : (
            parseFloat(pathLength) 
            ? (parseFloat(pathLength) / totalLength) * duration
            : 0.05
          ) * durationAdjustment

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

    this.applyValidPaths(element, settings, function(index, path) {
      // to do -- fill this in marker style
      path.setAttribute('opacity', '0')
    })
  }
}