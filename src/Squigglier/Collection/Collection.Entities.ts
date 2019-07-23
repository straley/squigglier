import { Collection } from './Collection'
import { Entity } from '../Entity/Entity';

export abstract class Entities extends Collection {

  constructor (
    parent: Entity,
    src: string,
    element: Element
  ) {
    super(parent, src, element, [ Entity ])
  }
}
