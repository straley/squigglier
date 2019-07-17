import { Animations, GeoMeta } from '../Animations'

export type FreehandAnimateSettings = {
  width?: number|string,
  duration?: number|string,
  minLength?: number|string,
}

export class Freehand {
  static render(
    element:SVGSVGElement, 
    settings:FreehandAnimateSettings={}, 
    nextAction:(element:SVGSVGElement)=>void
  ) {
    console.log('FREEHAND')
    // ensure style sheet
    Animations.withStyleSheet((styleSheet => {
      console.log('HAS CSS')
      // values from settings
      const id = element.getAttribute('id')
      const width = Animations.defaultFloat(settings.width, 30)
      const minLength = Animations.defaultFloat(settings.minLength, 0)
      const duration = Animations.defaultFloat(settings.duration, 3)

    // create definition block for mask geometries
      const defs = document.createElement('defs')

      // parse geometries in element 
      const validGeos = Animations.applyValidGeometries(element, settings)
      const meta:GeoMeta = Animations.geometriesToGeoMeta(validGeos, minLength, duration)

      // add classes and masks for animations
      Object.keys(meta.geoData)
        .forEach(index => {
          const data = meta.geoData[index]

          if (!data.drawable) {
            data.geo.classList.add(`${id}-tiny-${index}`)

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
                animation: ${id}-freehand-${index} 0s linear forwards;
                animation-delay: ${data.delay}s;
              }
            `)
            return
          }

          Animations.addElement(defs, `
            <mask id="${id}-mask-${index}" maskUnits="userSpaceOnUse">
              <path class="${id}-mask" d="${data.geo.getAttribute('d')}"/>
            </mask>
          `, 'beforeend')

          data.geo.setAttribute('mask', `url(#${id}-mask-${index})`)

          // add css mask settings
          styleSheet.insertRule(`
            #${id}-mask-${index} {
              fill: none;
              stroke: white;
              stroke-width: ${width};
              stroke-dasharray: ${data.length} ${data.length};
              stroke-dashoffset: ${data.length};
              animation: ${id}-freehand-${index} ${data.duration}s linear forwards;
              animation-delay: ${data.delay}s;
            }
          `)

          // add css keyframe for animation
          styleSheet.insertRule(`
            @keyframes ${id}-freehand-${index} {
              from { stroke-dashoffset: ${data.length}; }
              to { stroke-dashoffset: 0; }
            }
          `)
        })

      // add defnition block to the beginning of the element
      element.insertAdjacentElement('afterbegin', defs)

    }))

    if (typeof nextAction === 'function') {
      nextAction(element)
    }
  }
}