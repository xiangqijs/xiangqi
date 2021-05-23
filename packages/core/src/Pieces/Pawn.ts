import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （兵 | 卒）类
 */
export default class Pawn extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Pawn });
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
    const positionInteraction = PositionInteraction.load(this.position);
    if (this.side === Side.Black) {
      // 黑方
      if (positionInteraction.y <= 5) {
        // 未过河每次只能向前走一步
        return [positionInteraction.clone().bottom()];
      }
      // 过河不能向后走
      return [
        positionInteraction.clone().bottom(),
        positionInteraction.clone().right(),
        positionInteraction.clone().left(),
      ];
    }

    // 红方
    if (positionInteraction.y >= 6) {
      // 未过河每次只能向前走一步
      return [positionInteraction.clone().top()];
    }
    // 过河不能向后走
    return [positionInteraction.clone().top(), positionInteraction.clone().right(), positionInteraction.clone().left()];
  }
}
