import Base from './Base';
import type { Position } from './Base';

export function filterPositions(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: Base, ...args: any[]) {
    const result: Position[] = originalMethod.apply(this, [...args]);
    return this.loadPositions(result);
  };
}

export function isPositionEqual(positionA: Position, positionB: Position) {
  return positionA.x === positionB.x && positionA.y === positionB.y;
}