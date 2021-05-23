import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （馬 | 傌）类
 */
export default class Knight extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Cannon });
  }

  static createRed(options: PieceCreateOptions) {
    return new Knight({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new Knight({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '馬' : '傌';
  }

  @filterPositions
  getNextPositions() {
    const result: Position[] = [];

    const positionInteraction = PositionInteraction.load(this.position);

    const blockPositions = {
      top: positionInteraction.clone().top(),
      right: positionInteraction.clone().right(),
      bottom: positionInteraction.clone().bottom(),
      left: positionInteraction.clone().left(),
    };

    const unblockPositions = {
      top: [positionInteraction.clone().top(2).left(), positionInteraction.clone().top(2).right()],
      right: [positionInteraction.clone().right(2).top(), positionInteraction.clone().right(2).bottom()],
      bottom: [positionInteraction.clone().bottom(2).left(), positionInteraction.clone().bottom(2).right()],
      left: [positionInteraction.clone().left(2).top(), positionInteraction.clone().left(2).bottom()],
    };

    Object.keys(blockPositions).forEach((direction) => {
      const blockPiece = this.board.findPiece(blockPositions[direction as keyof typeof blockPositions]);
      if (!blockPiece) {
        unblockPositions[direction as keyof typeof blockPositions].forEach((item) => {
          const pieceAtPosition = this.board.findPiece(item);
          if (!pieceAtPosition) {
            result.push(item);
          }
          if (pieceAtPosition && pieceAtPosition.side !== this.side) {
            result.push(item);
          }
        });
      }
    });

    return result;
  }
}
