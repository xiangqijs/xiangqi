import { Board, DumpedBoard, Side, Type, PositionInteraction, Move as TheMove } from '@xiangqijs/core';
import _cloneDeep from 'lodash/cloneDeep';
import _last from 'lodash/last';

import { getPieceValue } from './piecePosition';
import { getBoardInstance } from '../utils';
import { Move, Result } from '../types';

// 局面评估函数，返回红方优势估值
function evaluateBoard(board: Board) {
  let result = 0;
  board.pieces.forEach((piece) => {
    result += piece.side === Side.Red ? getPieceValue(piece) : -getPieceValue(piece);
  });

  return result;
}

/** 判断下一步是否会被将军 */
function checkKing(board: Board) {
  const selfKing = board.pieces.find((item) => item.type === Type.King && item.side === board.turn)!;
  const kingPosition = new PositionInteraction(selfKing.position);
  const opponentPieces = board.pieces.filter((item) => item.side !== board.turn);
  return opponentPieces.some((piece) => {
    const nextPositions = piece.getNextPositions();
    return nextPositions.some((position) => kingPosition.equal(position));
  });
}

export interface SearchResult {
  move?: Move;
  value: number;
}

function maxSearch(board: Board, depth: number, parentMove?: Move): SearchResult {
  console.log('call maxSearch, depth', depth);
  const result = {
    move: parentMove,
    value: -Infinity,
  };
  // 到达目标深度后调用评估函数并返回红方优势估值
  if (depth === 0) {
    return {
      move: parentMove,
      value: evaluateBoard(board),
    };
  }

  let nextMoves: TheMove[] = [];
  board.redPieces().forEach((piece) => {
    nextMoves = nextMoves.concat(board.getNextMoves(piece));
  });
  nextMoves.forEach((move) => {
    const targetPiece = board.findPiece(move.from)!;
    board.move(targetPiece, move.to);

    // 下一步会导致己方王棋被吃，跳过
    if (checkKing(board)) {
      board.undo();
      return;
    }
    const theMove =
      parentMove ||
      _cloneDeep({
        from: move.from,
        to: move.to,
      });
    const minSearchResult = minSearch(board, depth - 1, theMove);

    if (minSearchResult.value > result.value) {
      result.move = theMove;
      result.value = minSearchResult.value;
    }
    board.undo();
  });

  return result;
}

function minSearch(board: Board, depth: number, parentMove?: Move): SearchResult {
  console.log('call minSearch, depth', depth);
  const result = {
    move: parentMove,
    value: Infinity,
  };
  // 到达目标深度后调用评估函数并返回红方优势估值
  if (depth === 0) {
    return {
      move: parentMove,
      value: evaluateBoard(board),
    };
  }

  let nextMoves: TheMove[] = [];
  board.blackPieces().forEach((piece) => {
    nextMoves = nextMoves.concat(board.getNextMoves(piece));
  });
  nextMoves.forEach((move) => {
    const targetPiece = board.findPiece(move.from)!;
    board.move(targetPiece, move.to);

    // 下一步会导致己方王棋被吃，跳过
    if (checkKing(board)) {
      board.undo();
      return;
    }
    const theMove =
      parentMove ||
      _cloneDeep({
        from: move.from,
        to: move.to,
      });
    const maxSearchResult = maxSearch(board, depth - 1, theMove);

    if (maxSearchResult.value < result.value) {
      result.move = theMove;
      result.value = maxSearchResult.value;
    }
    board.undo();
  });

  return result;
}

export interface MinimaxOptions {
  depth?: Number;
  timeout?: Number;
}

export default function minimax(inputBoard: DumpedBoard | Board, options?: MinimaxOptions): Result {
  const board = getBoardInstance(inputBoard);
  const result = board.turn === Side.Red ? maxSearch(board, 2) : minSearch(board, 2);
  console.log('minimax result', result);
  return result?.move || null;
}
