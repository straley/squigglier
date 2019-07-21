import { Collection } from './Collection'
import { Entity } from '../Entity/Entity';

export abstract class Entities extends Collection {

  constructor (
    element: Element
  ) {
    super(element, [ Entity ])
  }
}
