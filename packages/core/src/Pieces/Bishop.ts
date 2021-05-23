import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （相 | 象）类
 */
export default class Bishop extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Bishop });
  }

  static createRed(options: PieceCreateOptions) {
    return new Bishop({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new Bishop({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '相' : '象';
  }

  @filterPositions
  getNextPositions() {
    const result: Position[] = [];

    const positionInteraction = PositionInteraction.load(this.position);

    const blockPositions = {
      topLeft: positionInteraction.clone().top().left(),
      topRight: positionInteraction.clone().top().right(),
      bottomLeft: positionInteraction.clone().bottom().left(),
      bottomRight: positionInteraction.clone().bottom().right(),
    };

    const nextPositions = {
      topLeft: positionInteraction.clone().top(2).left(2),
      topRight: positionInteraction.clone().top(2).right(2),
      bottomLeft: positionInteraction.clone().bottom(2).left(2),
      bottomRight: positionInteraction.clone().bottom(2).right(2),
    };

    Object.keys(blockPositions).forEach((direction) => {
      const blockPiece = this.board.findPiece(blockPositions[direction as keyof typeof blockPositions]);
      if (!blockPiece) {
        const nextPosition = nextPositions[direction as keyof typeof nextPositions];
        const pieceAtPosition = this.board.findPiece(nextPosition);
        if (!pieceAtPosition) {
          result.push(nextPosition);
        }
        if (pieceAtPosition && pieceAtPosition.side !== this.side) {
          result.push(nextPosition);
        }
      }
    });

    return result.filter((item) => (this.side === Side.Red ? item.y >= 6 : item.y <= 5));
  }
}
