import { Animations } from '../Animations'
import { Sequence } from '../Sequence';


export class FillIn {
  static render(
    settings: any = {},
    sequence: Sequence
  ) {
    // ensure style sheet
    const geos = Animations.applyValidGeometries(sequence.element(), settings)
    const id = sequence.element().getAttribute('id')
    const opacity = Animations.defaultFloat(settings.opacity, 0)
    const delay = Animations.defaultFloat(settings.delay, 0)
    const duration = Animations.defaultFloat(settings.duration, 0)
    const fill = settings.fill

    Object.keys(geos).forEach(index => {
      const geo = geos[index]
      const seqId = `${id}-${sequence.index()}-${index}`
      const className = `${id}-fill-${index}`

      // add css keyframe for animation
      // to-do make this more generated
      // store last to value as next from value
      sequence.style()
        .keyframes(`${seqId}-opacity`)
        .add({
          from: {
            opacity: 0 
          },
          to: { 
            ... fill ? { fill } : {},
            opacity 
          }
        }) 

      geo.classList.add(className)

      sequence.style()
        .selector(`.${className}`)
        .add({
          animation: `${seqId}-opacity ${duration}s linear ${delay}s forwards`
        })
    })

    sequence.run()
  }
}