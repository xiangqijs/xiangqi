import produce from 'immer';
import _slice from 'lodash/slice';
import _cloneDeep from 'lodash/cloneDeep';
import _last from 'lodash/last';
import _padStart from 'lodash/padStart';

import { Pawn, Cannon, Rook, Knight, Bishop, Advisor, King, Pieces } from '../Pieces';
import PieceBase, { Limit, Position, Side, DumpedPiece, Type, PieceBaseOptions } from '../Pieces/Base';
import type { Emitter } from '../Game';

export interface DumpedBoard {
  turn: Side;
  pieces: DumpedPiece[];
  history: Move[];
  head: number;
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
// 根据[FEN(福斯夫－爱德华兹记号法)](https://zh.wikipedia.org/wiki/%E7%A6%8F%E6%96%AF%E5%A4%AB%EF%BC%8D%E6%84%9B%E5%BE%B7%E8%8F%AF%E8%8C%B2%E8%A8%98%E8%99%9F%E6%B3%95)命名

export interface BoardOptions {
  // 事件监听器
  emitter?: Emitter;
}

export default class Board extends Limit {
  turn = Side.Red;

  positions = this.getPositions();

  #history: Move[] = [];

  #head = -1;

  pieces = [...this.initBlockPieces(), ...this.initRedPieces()] as PieceBase[];

  emitter?: Emitter;

  get history() {
    return this.#history;
  }

  set history(history: Move[]) {
    // console.log('set history', history);
    this.#history = history;
  }

  get head() {
    return this.#head;
  }

  set head(head: number) {
    // console.log('set head', this.head, '=>', head);
    if (head < 0) {
      throw new Error(`非法 head: ${head}`);
    }
    this.#head = head;
  }

  constructor(options?: BoardOptions) {
    super();
    this.emitter = options?.emitter;
  }

  onMove(piece: PieceBase, eatenPiece?: PieceBase) {
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
    if (this.head + 1 !== this.history.length) {
      this.history = produce(this.history, (draft) => {
        return _slice(draft, 0, this.head + 1);
      });
    }

    const lastMove = _last(this.history);
    if (lastMove && lastMove.side === move.side) {
      console.log('非法 move，应为对方回合', JSON.stringify(move));
    }

    this.history = produce(this.history, (draft) => {
      draft.push(move);
    });
    this.head = this.history.length - 1;
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

  redPieces() {
    return this.pieces.filter((item) => item.side === Side.Red);
  }

  blackPieces() {
    return this.pieces.filter((item) => item.side === Side.Black);
  }

  end() {
    return this.pieces.filter((item) => item.type === Type.King).length < 2;
  }

  reset() {
    this.pieces = [...this.initBlockPieces(), ...this.initRedPieces()];
    this.turn = Side.Red;
    this.emitter?.emit('reset', this);
  }

  canUndo() {
    return this.history.length > 0 && this.head >= 0;
  }

  undo() {
    if (this.canUndo()) {
      // 落子之后在对方回合，故需要先换边再悔棋
      this.switch();
      const undoMove = this.history[this.head];
      const targetPiece = this.findPiece(undoMove.to)!;
      targetPiece.position = undoMove.from;
      targetPiece.prevPosition = undefined;
      if (undoMove.eat) {
        const eatenPiece = Board.createPiece({
          board: this,
          type: undoMove.eat,
          side: undoMove.side === Side.Black ? Side.Red : Side.Black,
          initPosition: undoMove.to,
        });
        this.pieces.push(eatenPiece);
      }
      this.head -= 1;
      this.emitter?.emit('undo', undoMove);
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
      this.emitter?.emit('redo', redoMove);
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
    this.emitter?.emit('switch', this.turn);
  }

  eatPiece(positionOrPiece: Position | PieceBase) {
    const piece = positionOrPiece instanceof PieceBase ? positionOrPiece : this.findPiece(positionOrPiece);
    if (piece && piece.side !== this.turn) {
      this.pieces = this.pieces.filter((item) => item !== piece);
      this.emitter?.emit('eat', piece);
      return piece;
    }
  }

  dump(): DumpedBoard {
    return {
      turn: this.turn,
      pieces: this.pieces.map((item) => item.dump()),
      history: _cloneDeep(this.history),
      head: this.head,
    };
  }

  /** 获取目标棋子的下一步的所有着法 */
  getNextMoves(piece: PieceBase): Move[] {
    const nextPositions = piece.getNextPositions();
    return nextPositions.map((item) => {
      const move: Move = {
        type: piece.type,
        side: piece.side,
        from: piece.position,
        to: item,
      };
      const eatenPiece = this.findPiece(item);
      if (eatenPiece) {
        move.eat = eatenPiece.type;
      }
      return move;
    });
  }

  /** 移动棋子到下一位置 */
  move(piece: PieceBase, position: Position) {
    if (piece.nextPositionsContain(position)) {
      const eatenPiece = this.eatPiece(position);

      piece.prevPosition = piece.position;
      piece.position = position;

      this.onMove(piece, eatenPiece);
      this.emitter?.emit('move', piece, eatenPiece);
      if (this.end()) {
        // 当移除王棋时游戏结束，无需换边
        return;
      }
      this.switch();
    } else {
      console.log(`[warn] next position illegal: ${JSON.stringify(piece.position)} => ${JSON.stringify(position)}`);
    }
  }

  static createPiece(options: PieceBaseOptions) {
    const MapPiece = Pieces[options.type];
    return new MapPiece({
      board: options.board,
      side: options.side,
      initPosition: options.initPosition,
    });
  }

  static load(dumpedBoard: DumpedBoard, options?: BoardOptions) {
    const board = new Board(options);
    board.turn = dumpedBoard.turn;
    board.pieces = dumpedBoard.pieces.map((item) => {
      return Board.createPiece({
        board,
        type: item.type,
        side: item.side,
        initPosition: item.position,
      });
    });
    board.history = dumpedBoard.history;
    board.head = dumpedBoard.head;
    return board;
  }

  clone(options?: BoardOptions) {
    return Board.load(this.dump(), options);
  }

  beautify() {
    let result = '## 1,2,3,4,5,6,7,8,9\n';
    this.positions.forEach((position, index) => {
      if (index % this.maxX === 0) {
        result += `${_padStart(`${index / this.maxX + 1}`, 2, '0')} `;
      }
      const piece = this.findPiece(position);
      if (piece) {
        result += `${piece.getFENChar()} `;
      } else {
        result += '_ ';
      }
      if (index % this.maxX === 8) {
        result = result.trim();
        result += `\n`;
      }
    });
    return `\n${result}`;
  }
}
