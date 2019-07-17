import { Animations } from '../Animations'

export class FillIn {
  static render(
    element:SVGSVGElement, 
    settings={},
    nextAction:(element:SVGSVGElement)=>void
  ) {
    // ensure style sheet
    Animations.withStyleSheet(styleSheet => {
      const geos = Animations.applyValidGeometries(element, settings)
      Object.keys(geos).forEach(index => {
        const geo = geos[index]
        // to do -- fill this in marker style
        geo.setAttribute('opacity', '0.25')
      })
    })

    if (typeof nextAction === 'function') {
      nextAction(element)
    }
  }
}