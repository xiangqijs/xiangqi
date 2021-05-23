import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （仕 | 士）类
 */
export default class Advisor extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Advisor });
  }

  static createRed(options: PieceCreateOptions) {
    return new Advisor({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new Advisor({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '仕' : '士';
  }

  @filterPositions
  getNextPositions() {
    const result: Position[] = [];

    const positionInteraction = PositionInteraction.load(this.position);

    const nextPositions = [
      positionInteraction.clone().top().left(),
      positionInteraction.clone().top().right(),
      positionInteraction.clone().bottom().left(),
      positionInteraction.clone().bottom().right(),
    ];

    nextPositions.forEach((item) => {
      const piece = this.board.findPiece(item);
      if (!piece) {
        result.push(item);
      }
      if (piece && piece.side !== this.side) {
        result.push(item);
      }
    });

    return result.filter(
      (item) =>
        item.x >= 4 &&
        item.x <= 6 &&
        (this.side === Side.Red ? item.y >= 8 && item.y <= 10 : item.y >= 1 && item.y <= 3)
    );
  }
}
