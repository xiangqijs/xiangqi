import Base, { Type, Side, PositionInteraction } from './Base';
import type { PieceInitOptions, PieceCreateOptions, Position } from './Base';
import { filterPositions } from './utils';

/**
 * （車 | 俥）类
 */
export default class Rook extends Base {
  constructor(options: PieceInitOptions) {
    super({ ...options, type: Type.Cannon });
  }

  static createRed(options: PieceCreateOptions) {
    return new Rook({
      ...options,
      side: Side.Red,
    });
  }

  static createBlack(options: PieceCreateOptions) {
    return new Rook({
      ...options,
      side: Side.Black,
    });
  }

  getName() {
    return this.side === Side.Red ? '車' : '俥';
  }

  @filterPositions
  getNextPositions() {
    const result: Position[] = [];

    const positionInteraction = PositionInteraction.load(this.position);
    /** top, right, bottom, left 四个方向遇到的棋子计数集合 */
    const piecesCount = [0, 0, 0, 0];

    /** 获取四个方向上的下一轮位置 */
    const getNextTurnPositions = (turn = 1) => {
      let nextTopPosition = positionInteraction.clone().top(turn);
      let nextRightPosition = positionInteraction.clone().right(turn);
      let nextBottomPosition = positionInteraction.clone().bottom(turn);
      let nextLeftPosition = positionInteraction.clone().left(turn);
      return [nextTopPosition, nextRightPosition, nextBottomPosition, nextLeftPosition];
    };

    let turn = 1;
    while (true) {
      const nextPositions = getNextTurnPositions(turn);

      const hasValidPosition = nextPositions.find((item) => item.valid());
      if (!hasValidPosition) {
        // 四个方向都没有有效的位置时结束循环
        break;
      }

      nextPositions.forEach((item, index) => {
        if (!item.valid()) {
          // 无效位置跳过
          return;
        }
        const pieceAtPosition = this.board.findPiece(item);
        if (!pieceAtPosition && piecesCount[index] === 0) {
          // 如果给定位置没有棋子且在此之前还未找到棋子则为可用位置
          result.push(item);
        }
        if (pieceAtPosition) {
          // 计算逻辑上与 Cannon 基本相同，0 => 1 则为 Cannon
          if (piecesCount[index] === 0 && pieceAtPosition.side !== this.side) {
            // 如果当前位置有棋子且之前没有棋子则为可用位置
            result.push(item);
          }
          // 各方向上棋子计数累加
          piecesCount[index] += 1;
        }
      });

      turn += 1;
    }

    return result;
  }
}
