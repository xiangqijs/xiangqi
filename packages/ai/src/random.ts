import { Board, DumpedBoard, PieceBase } from '@xiangqijs/core';

import { getBoardInstance, getRandomInt } from './utils';

export default function random(inputBoard: DumpedBoard | Board) {
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
    current: randomPiece.position,
    next: nextPosition,
  };
}
