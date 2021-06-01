import { createNanoEvents } from 'nanoevents';
import type { Emitter as NanoEmitter } from 'nanoevents';

import Board, { Move } from '../Board';
import { PieceBase, Side } from '../Pieces';

export function createEvents() {
  return createNanoEvents<Events>();
}

export interface Events {
  move: (piece: PieceBase, eatenPiece?: PieceBase) => void;
  eat: (piece: PieceBase) => void;
  undo: (move: Move) => void;
  redo: (move: Move) => void;
  reset: (board: Board) => void;
  switch: (side: Side) => void;
}

/**
 * 象棋比赛规则：https://www.xqbase.com/protocol/rule_asian.htm
 */
export default class Game {
  emitter = createEvents();

  board = new Board({ emitter: this.emitter });

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return this.emitter.on(event, callback);
  }
}

export type Emitter = NanoEmitter<Events>;
