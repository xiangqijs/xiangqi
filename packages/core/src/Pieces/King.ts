import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions, whetherKingsFaced } from './utils';

/**
 * （帥 | 將）类
 */
export default class King extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.King });
  }

  static createRed(options: PieceCreateOptions) {
    return new King({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new King({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '帥' : '將';
  }

  @filterPositions
  getNextPositions() {
    let result: Position[] = [];

    const positionInteraction = PositionInteraction.load(this.position);

    const nextPositions = [
      positionInteraction.clone().top(),
      positionInteraction.clone().right(),
      positionInteraction.clone().bottom(),
      positionInteraction.clone().left(),
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

    result = result.filter(
      (item) =>
        item.x >= 4 &&
        item.x <= 6 &&
        (this.side === Side.Red ? item.y >= 8 && item.y <= 10 : item.y >= 1 && item.y <= 3)
    );

    const otherSideKing = this.board.pieces.find((item) => item.type === Type.King && item.side !== this.side) as King;

    return result.filter((nextPosition) => {
      return !whetherKingsFaced({
        kingPositions: [otherSideKing.position, nextPosition],
        board: this.board,
      });
    });
  }
}
