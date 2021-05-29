import { Pawn, Cannon, Rook, Knight, Bishop, Advisor, King, Pieces } from '../Pieces';
import PieceBase, { Limit, Position, Side, DumpedPiece, Type, PieceBaseOptions } from '../Pieces/Base';
import emitter from '../emitter';

export interface DumpedBoard {
  turn: Side;
  pieces: DumpedPiece[];
}

/** 每一着的数据结构 */
export interface Move {
  type: Type;
  side: Side;
  from: Position;
  to: Position;
  // 该着是否吃对方棋子
  eat?: Type;
}

// 棋盘坐标定义：
//
// 原点坐标 (1, 1)
//     ┌──────────> x
//     │
//     │
//     │
//     │
//     y

export default class Board extends Limit {
  turn = Side.Red;

  positions = this.getPositions();

  history: Move[] = [];

  head = -1;

  pieces = [...this.initBlockPieces(), ...this.initRedPieces()];

  constructor() {
    super();
    emitter.on('move', (piece, eatenPiece) => {
      const move: Move = {
        type: piece.type,
        side: piece.side,
        from: piece.prevPosition!,
        to: piece.position,
      };
      if (eatenPiece) {
        move.eat = eatenPiece.type;
      }

      // 如果 head 不是指向最后一着，则在移动时需要重写 history
      if (this.head + 1 < this.history.length) {
        this.history = this.history.slice(0, this.head + 1);
      }

      this.history.push(move);
      this.head = this.history.length - 1;
    });
  }

  initBlockPieces() {
    return [
      Pawn.createBlack({ initPosition: { x: 1, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 3, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 5, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 7, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 9, y: 4 }, board: this }),
      Cannon.createBlack({ initPosition: { x: 2, y: 3 }, board: this }),
      Cannon.createBlack({ initPosition: { x: 8, y: 3 }, board: this }),
      Rook.createBlack({ initPosition: { x: 1, y: 1 }, board: this }),
      Rook.createBlack({ initPosition: { x: 9, y: 1 }, board: this }),
      Knight.createBlack({ initPosition: { x: 2, y: 1 }, board: this }),
      Knight.createBlack({ initPosition: { x: 8, y: 1 }, board: this }),
      Bishop.createBlack({ initPosition: { x: 3, y: 1 }, board: this }),
      Bishop.createBlack({ initPosition: { x: 7, y: 1 }, board: this }),
      Advisor.createBlack({ initPosition: { x: 4, y: 1 }, board: this }),
      Advisor.createBlack({ initPosition: { x: 6, y: 1 }, board: this }),
      King.createBlack({ initPosition: { x: 5, y: 1 }, board: this }),
    ];
  }

  initRedPieces() {
    return [
      Pawn.createRed({ initPosition: { x: 1, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 3, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 5, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 7, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 9, y: 7 }, board: this }),
      Cannon.createRed({ initPosition: { x: 2, y: 8 }, board: this }),
      Cannon.createRed({ initPosition: { x: 8, y: 8 }, board: this }),
      Rook.createRed({ initPosition: { x: 1, y: 10 }, board: this }),
      Rook.createRed({ initPosition: { x: 9, y: 10 }, board: this }),
      Knight.createRed({ initPosition: { x: 2, y: 10 }, board: this }),
      Knight.createRed({ initPosition: { x: 8, y: 10 }, board: this }),
      Bishop.createRed({ initPosition: { x: 3, y: 10 }, board: this }),
      Bishop.createRed({ initPosition: { x: 7, y: 10 }, board: this }),
      Advisor.createRed({ initPosition: { x: 4, y: 10 }, board: this }),
      Advisor.createRed({ initPosition: { x: 6, y: 10 }, board: this }),
      King.createRed({ initPosition: { x: 5, y: 10 }, board: this }),
    ];
  }

  end() {
    return this.pieces.filter((item) => item.type === Type.King).length < 2;
  }

  reset() {
    this.pieces = [...this.initBlockPieces(), ...this.initRedPieces()];
    this.turn = Side.Red;
    emitter.emit('reset', this);
  }

  canUndo() {
    return this.history.length > 0 && this.head >= 0;
  }

  undo() {
    if (this.canUndo()) {
      const undoMove = this.history[this.head];
      const targetPiece = this.findPiece(undoMove.to)!;
      targetPiece.position = undoMove.from;
      targetPiece.prevPosition = undefined;
      if (undoMove.eat) {
        this.createPiece({
          type: undoMove.eat,
          side: undoMove.side === Side.Black ? Side.Red : Side.Black,
          initPosition: undoMove.to,
        });
      }
      this.head -= 1;
      emitter.emit('undo', undoMove);
    } else {
      console.warn('cannot undo!');
    }
  }

  canRedo() {
    return this.head + 1 !== this.history.length;
  }

  redo() {
    if (this.canRedo()) {
      const redoMove = this.history[this.head + 1];
      const targetPiece = this.findPiece(redoMove.from)!;
      targetPiece.position = redoMove.to;
      targetPiece.prevPosition = redoMove.from;
      if (redoMove.eat) {
        this.eatPiece(redoMove.to);
      }
      this.head += 1;
      emitter.emit('undo', redoMove);
    } else {
      console.warn('cannot redo!');
    }
  }

  /**
   * 获取棋盘中所有可用的位置集合
   *
   * @returns
   */
  getPositions() {
    const result: Position[] = [];

    let currentY = 1;
    do {
      let currentX = 1;
      do {
        result.push({ x: currentX, y: currentY });
        currentX += 1;
      } while (currentX <= this.maxX);
      currentY += 1;
    } while (currentY <= this.maxY);

    return result;
  }

  findPiece(position: Position) {
    return this.pieces.find((piece) => piece.at(position));
  }

  /** 换边 */
  switch() {
    this.turn = this.turn === Side.Red ? Side.Black : Side.Red;
    emitter.emit('switch', this.turn);
  }

  eatPiece(positionOrPiece: Position | PieceBase) {
    const piece = positionOrPiece instanceof PieceBase ? positionOrPiece : this.findPiece(positionOrPiece);
    if (piece && piece.side !== this.turn) {
      this.pieces = this.pieces.filter((item) => item !== piece);
      emitter.emit('eat', piece);
      return piece;
    }
  }

  dump(): DumpedBoard {
    return {
      turn: this.turn,
      pieces: this.pieces.map((item) => item.dump()),
    };
  }

  createPiece(options: Omit<PieceBaseOptions, 'board'>) {
    const MapPiece = Pieces[options.type];
    return new MapPiece({
      board: this,
      side: options.side,
      initPosition: options.initPosition,
    });
  }

  static load(dumpedBoard: DumpedBoard) {
    const board = new Board();
    board.turn = dumpedBoard.turn;
    board.pieces = dumpedBoard.pieces.map((item) => {
      return board.createPiece({
        type: item.type,
        side: item.side,
        initPosition: item.position,
      });
    });
    return board;
  }
}
