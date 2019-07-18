import { Animations } from '../Animations'
import { Sequence } from '../Sequence';


// todo - move to class
const findRule = (styleSheet:CSSStyleSheet, className:string, update?:string) => {
  for (let i=0; i<styleSheet.rules.length; i++) {
    const rule = styleSheet.rules[i]
    if (rule['selectorText'] === `.${className}`) {
      if (update) {
        styleSheet.rules[i]['cssText'] = update
      }

      return rule
    }
  }
  return null
}

export class FillIn {
  static render(
    settings: any = {},
    sequence: Sequence
  ) {
    // ensure style sheet
    Animations.withStyleSheet((styleSheet:CSSStyleSheet) => {
      const geos = Animations.applyValidGeometries(sequence.element(), settings)
      const id = sequence.element().getAttribute('id')
      const opacity = Animations.defaultFloat(settings.opacity, 0)
      const delay = Animations.defaultFloat(settings.delay, 0)
      const duration = Animations.defaultFloat(settings.duration, 0)

      Object.keys(geos).forEach(index => {
        const geo = geos[index]
        const seqId = `${id}-${sequence.index()}-${index}`
        const className = `${id}-fill-${index}`

        // add css keyframe for animation
        // to-do make this more generated
        // store last to value as next from value
        sequence.addKeyFramesRule(
          `${seqId}-opacity`, `
          {
            from { opacity: 0; }
            to { opacity: ${opacity}; }
          }
        `) 

        geo.classList.add(className)

        sequence.addSelectorRule(
          `.${className}`, `
          {
            animation: ${seqId}-opacity ${duration}s linear ${delay}s forwards;
          }
        `)

      })
    })

    sequence.nextAction()
  }
}