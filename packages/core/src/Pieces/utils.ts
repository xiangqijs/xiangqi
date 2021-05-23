import Base, { PositionInteraction } from './Base';
import type { Position } from './Base';

export function filterPositions(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: Base, ...args: any[]) {
    const result: PositionInteraction[] = originalMethod.apply(this, [...args]);
    return result.filter((item) => PositionInteraction.load(item).valid()).map((item) => item.dump());
  };
}

export function isPositionEqual(positionA: Position | PositionInteraction, positionB: Position | PositionInteraction) {
  return positionA.x === positionB.x && positionA.y === positionB.y;
}
