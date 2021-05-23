import Base, { PositionInteraction, Type } from './Base';
import type { Position } from './Base';
import Board from '../Board';

export function whetherKingsFaced(options: {
  kingPositions: [Position, Position];
  board: Board;
  // 非王棋子及其下一步
  notKingPiece?: {
    piece: Base;
    // 非王棋子的下一步
    nextPosition: Position;
  };
}) {
  const { kingPositions, board, notKingPiece } = options;
  const [kingA, kingB] = kingPositions;
  if (kingA.x !== kingB.x) {
    return false;
  } else {
    const targetX = kingA.x;
    const piecesVertical = board.pieces.filter((item) => item.position.x === targetX);
    const piecesVerticalBetweenKings = piecesVertical.filter(
      (item) => item.position.y > Math.min(kingA.y, kingB.y) && item.position.y < Math.max(kingA.y, kingB.y)
    );
    if (piecesVerticalBetweenKings.length >= 2) {
      return false;
    }
    if (piecesVerticalBetweenKings.length === 0) {
      return true;
    }
    // 当两王之间只有一个棋子时
    const onlyOnePiece = piecesVerticalBetweenKings[0];
    if (notKingPiece && onlyOnePiece === notKingPiece?.piece && notKingPiece.nextPosition.x !== targetX) {
      return true;
    }
    return false;
  }
}

export function filterPositions(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: Base, ...args: any[]) {
    let result: (Position | PositionInteraction)[] = originalMethod.apply(this, [...args]);
    result = result
      .filter((item) => PositionInteraction.load(item).valid())
      .map((item) => (item instanceof PositionInteraction ? item.dump() : item));
    return result.filter((nextPosition) => {
      const [kingA, kingB] = this.board.pieces.filter((item) => item.type === Type.King);
      return !whetherKingsFaced({
        kingPositions: [kingA.position, kingB.position],
        board: this.board,
        notKingPiece: {
          piece: this,
          nextPosition: nextPosition,
        },
      });
    });
  };
}

export function isPositionEqual(positionA: Position | PositionInteraction, positionB: Position | PositionInteraction) {
  return positionA.x === positionB.x && positionA.y === positionB.y;
}
