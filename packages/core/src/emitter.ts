import { createNanoEvents } from 'nanoevents';
import type { Emitter } from 'nanoevents';

import { PieceBase, Side } from './Pieces';
import Board, { Move } from './Board';

export interface Events {
  move: (piece: PieceBase, eatenPiece?: PieceBase) => void;
  eat: (piece: PieceBase) => void;
  undo: (move: Move) => void;
  redo: (move: Move) => void;
  reset: (board: Board) => void;
  switch: (side: Side) => void;
}

const emitter = createNanoEvents<Events>();

export default emitter;

export type { Emitter };
