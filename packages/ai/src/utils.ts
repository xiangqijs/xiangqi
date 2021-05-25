import { Board, DumpedBoard } from '@xiangqijs/core';

export function getBoardInstance(board: DumpedBoard | Board) {
  return board instanceof Board ? board : Board.load(board);
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max); // < max
}
