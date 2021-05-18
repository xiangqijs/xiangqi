import Base, { Type, Side } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （兵 | 卒）类
 */
export default class Pawn extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Pawn });

    this.checkPosition = this.checkPosition.bind(this);
  }

  static createRed(options: PieceCreateOptions) {
    return new Pawn({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new Pawn({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '兵' : '卒';
  }

  @filterPositions
  getNextPositions() {
    if (this.side === Side.Black) {
      // 黑方
      if (this.position.y <= 5) {
        // 未过河每次只能向前走一步
        return [{ x: this.position.x, y: this.position.y + 1 }];
      }
      // 过河不能向后走
      return [
        { x: this.position.x, y: this.position.y + 1 },
        { x: this.position.x + 1, y: this.position.y },
        { x: this.position.x - 1, y: this.position.y },
      ];
    }

    // 红方
    if (this.position.y >= 6) {
      // 未过河每次只能向前走一步
      return [{ x: this.position.x, y: this.position.y - 1 }];
    }
    // 过河不能向后走
    return [
      { x: this.position.x, y: this.position.y - 1 },
      { x: this.position.x + 1, y: this.position.y },
      { x: this.position.x - 1, y: this.position.y },
    ];
  }

  move(position: Position) {
    super.move(position);
  }
}
