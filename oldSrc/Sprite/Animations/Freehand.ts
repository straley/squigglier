import { Animations, GeoMeta } from '../Animations'
import { Sequence } from '../Sequence';

export type FreehandAnimateSettings = {
  width?: number|string,
  duration?: number|string,
  minLength?: number|string,
}

export class Freehand {
  static render(
    settings: any = {},
    sequence: Sequence
  ) {
    // values from settings
    const id = sequence.element().getAttribute('id')
    const width = Animations.defaultFloat(settings.width, 30)
    const minLength = Animations.defaultFloat(settings.minLength, 0)
    const duration = Animations.defaultFloat(settings.duration, 5)
    const awaitNext = typeof settings.await !== 'undefined' 

  // create definition block for mask geometries
    // const defs = document.createElement('defs')

    // parse geometries in element 
    const validGeos = Animations.applyValidGeometries(sequence.element(), settings)
    const meta:GeoMeta = Animations.geometriesToGeoMeta(validGeos, minLength, duration)

    // add classes and masks for animations
    Object.keys(meta.geoData)
      .forEach(index => {
        const data = meta.geoData[index]
        const seqId = `${id}-${sequence.index()}-${index}`

        if (!data.drawable) {
          data.geo.classList.add(`${seqId}-tiny`)

          // add css keyframe for animation
          sequence.style().keyframes(`${seqId}-freehand`).add({
            from: { opacity: 0 },
            to: { opacity: 1 }}
          )

          // add css settings
          sequence.style().selector(`.${seqId}-tiny`).add({
            opacity: 0,
            animation: `${seqId}-freehand 0s linear forwards`,
            'animation-delay': `${data.delay}s`
          })
          return
        }

        const mask = document.createElementNS(sequence.element().getAttribute('xmlns'), 'mask')
        mask.setAttribute('id', `${seqId}-mask`)
        mask.setAttribute('maskUnits', 'userSpaceOnUse')
        mask.innerHTML = `<path class="${seqId}-mask" d="${data.geo.getAttribute('d')}"/>`
        sequence.element().append(mask)

        data.geo.setAttribute('mask', `url(#${seqId}-mask)`)

        // add css mask settings
        sequence.style().selector(`#${seqId}-mask`).add({
          fill: `none`,
          stroke: `white`,
          'stroke-width': width,
          'stroke-dasharray': `${data.length} ${data.length}`,
          'stroke-dashoffset': `${data.length}`,
          'animation': `${seqId}-freehand ${data.duration}s linear forwards`,
          'animation-delay': `${data.delay}s`
        })

        // add css keyframe for animation
        sequence.style().keyframes(`${seqId}-freehand`).add({
          from: { 'stroke-dashoffset': data.length },
          to: { 'stroke-dashoffset': 0 }
        })
      })

    // add defnition block to the beginning of the element
    // sequence.element().insertAdjacentElement('afterbegin', defs)
    sequence.settings({
      delay: awaitNext ? meta.totalDelay : 0
    })
    sequence.run()
  }
}