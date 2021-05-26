import { createNanoEvents } from 'nanoevents';
import type { Emitter } from 'nanoevents';

import { PieceBase, Side } from './Pieces';
import Board from './Board';

export interface Events {
  move: (piece: PieceBase) => void;
  reset: (board: Board) => void;
  switch: (side: Side) => void;
}

const emitter = createNanoEvents<Events>();

export default emitter;

export type { Emitter };
