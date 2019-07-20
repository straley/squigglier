"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Animations_1 = require("../Animations");
class FillIn {
    static render(settings = {}, sequence) {
        // ensure style sheet
        const geos = Animations_1.Animations.applyValidGeometries(sequence.element(), settings);
        const id = sequence.element().getAttribute('id');
        const opacity = Animations_1.Animations.defaultFloat(settings.opacity, 0);
        const delay = Animations_1.Animations.defaultFloat(settings.delay, 0);
        const duration = Animations_1.Animations.defaultFloat(settings.duration, 0);
        const fill = settings.fill;
        Object.keys(geos).forEach(index => {
            const geo = geos[index];
            const seqId = `${id}-${sequence.index()}-${index}`;
            const className = `${id}-fill-${index}`;
            // add css keyframe for animation
            // to-do make this more generated
            // store last to value as next from value
            sequence.style()
                .keyframes(`${seqId}-opacity`)
                .add({
                from: {
                    opacity: 0
                },
                to: Object.assign({}, fill ? { fill } : {}, { opacity })
            });
            geo.classList.add(className);
            sequence.style()
                .selector(`.${className}`)
                .add({
                animation: `${seqId}-opacity ${duration}s linear ${delay}s forwards`
            });
        });
        sequence.run();
    }
}
exports.FillIn = FillIn;
//# sourceMappingURL=FillIn.js.map