import { Board, DumpedBoard, PieceBase } from '@xiangqijs/core';

import { getBoardInstance } from '../utils';
import { getRandomInt } from './utils';
import { Result } from '../types';

export default function random(inputBoard: DumpedBoard | Board): Result {
  const usedPieces: PieceBase[] = [];

  const board = getBoardInstance(inputBoard);
  const getRandomPiece: () => PieceBase | null = () => {
    const sidePieces = board.pieces
      .filter((item) => item.side === board.turn)
      .filter((item) => !usedPieces.includes(item));

    if (!sidePieces.length) {
      return null;
    }

    const randomPiece = sidePieces[getRandomInt(sidePieces.length)];
    if (randomPiece.getNextPositions().length) {
      return randomPiece;
    }
    usedPieces.push(randomPiece);
    return getRandomPiece();
  };

  const randomPiece = getRandomPiece();
  if (!randomPiece) {
    // 无棋子可移动，认输
    return null;
  }

  const nextPositions = randomPiece.getNextPositions();
  const nextPosition = nextPositions[getRandomInt(nextPositions.length)];
  return {
    from: randomPiece.position,
    to: nextPosition,
  };
}
