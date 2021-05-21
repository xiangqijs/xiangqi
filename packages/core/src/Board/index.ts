import { Pawn } from '../Pieces';
import PieceBase, { Limit, Position, Side } from '../Pieces/Base';
import emitter from '../emitter';

export default class Board extends Limit {
  turn = Side.Red;

  positions = this.getPositions();

  pieces = [...this.initBlockPieces(), ...this.initRedPieces()];

  initBlockPieces() {
    return [
      Pawn.createBlack({ initPosition: { x: 1, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 3, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 5, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 7, y: 4 }, board: this }),
      Pawn.createBlack({ initPosition: { x: 9, y: 4 }, board: this }),
    ];
  }

  initRedPieces() {
    return [
      Pawn.createRed({ initPosition: { x: 1, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 3, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 5, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 7, y: 7 }, board: this }),
      Pawn.createRed({ initPosition: { x: 9, y: 7 }, board: this }),
    ];
  }

  reset() {
    this.pieces = [...this.initBlockPieces(), ...this.initRedPieces()];
    emitter.emit('reset', this);
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
  }

  removePiece(positionOrPiece: Position | PieceBase) {
    const piece = positionOrPiece instanceof PieceBase ? positionOrPiece : this.findPiece(positionOrPiece);
    if (piece && piece.side !== this.turn) {
      this.pieces = this.pieces.filter((item) => item !== piece);
    }
  }
}
