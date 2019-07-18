import { 
  Animations, 
  AnimationSequence, 
  AnimationSequenceAction 
} from '../Animations'

export class FillIn {
  static render(
    element: SVGSVGElement, 
    settings: any,
    parent: HTMLElement,
    sequence: AnimationSequence, 
    nextAction: AnimationSequenceAction
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

    nextAction(element, parent, sequence)
  }
}