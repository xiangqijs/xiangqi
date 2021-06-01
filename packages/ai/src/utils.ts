import { Board, DumpedBoard, createEvents } from '@xiangqijs/core';

export function getBoardInstance(board: DumpedBoard | Board) {
  return board instanceof Board ? board.clone() : Board.load(board);
}
