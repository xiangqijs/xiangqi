export { default as PieceBase, PositionInteraction, Side, Type } from './Base';
export type { Position, DumpedPiece } from './Base';

import { default as Pawn } from './Pawn';
import { default as Cannon } from './Cannon';
import { default as Rook } from './Rook';
import { default as Knight } from './Knight';
import { default as Bishop } from './Bishop';
import { default as Advisor } from './Advisor';
import { default as King } from './King';

const Pieces = {
  Pawn,
  Cannon,
  Rook,
  Knight,
  Bishop,
  Advisor,
  King,
};

export { Pawn, Cannon, Rook, Knight, Bishop, Advisor, King, Pieces };
