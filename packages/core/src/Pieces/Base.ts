import Board from '../Board';
import emitter from '../emitter';
import { isPositionEqual } from './utils';

export enum Type {
  /** 将 | 帅 */
  King = 'King',
  /** 士 */
  Advisor = 'Advisor',
  /** 相 */
  Bishop = 'Bishop',
  /** 马 */
  Knight = 'Knight',
  /** 车 */
  Rook = 'Rook',
  /** 炮 */
  Cannon = 'Cannon',
  /** 兵 */
  Pawn = 'Pawn',
}

export enum Side {
  Red = 'Red',
  Black = 'Black',
}

export interface Position {
  /** 1-9 */
  x: number;
  /** 1-10 */
  y: number;
}

export interface PieceBaseOptions {
  board: Board;
  type: Type;
  side: Side;
  initPosition: Position;
}

/** 棋子默认初始化配置 */
export type PieceInitOptions = Omit<PieceBaseOptions, 'type'>;

/** 棋子静态方法创建配置 */
export type PieceCreateOptions = Omit<PieceInitOptions, 'side'>;

/** 棋子坐标限制 */
export class Limit {
  minX = 1;

  maxX = 9;

  minY = 1;

  maxY = 10;
}

/**
 * 棋子通用基类，主要记录棋子的元数据
 */
export default abstract class PieceBase extends Limit {
  static Type = Type;

  static Side = Side;

  board: Board;

  type: Type;

  side: Side;

  initPosition: Position;

  /** 棋子上次的位置 */
  prevPosition?: Position;

  position: Position;

  constructor(options: PieceBaseOptions) {
    super();

    this.board = options.board;
    this.type = options.type;
    this.side = options.side;
    this.initPosition = options.initPosition;
    this.position = options.initPosition;

    this.checkPosition = this.checkPosition.bind(this);
  }

  /**
   * 判断棋子是否在给定位置
   *
   * @param position
   * @returns
   */
  at(position: Position) {
    return this.position.x === position.x && this.position.y === position.y;
  }

  /**
   * 判断给定位置是否在下一步有效位置集合中
   *
   * @param position
   * @returns
   */
  nextPositionsContain(position: Position) {
    return this.getNextPositions().some((item) => isPositionEqual(item, position));
  }

  /**
   * 校验给定的位置是否合法
   *
   * @param position
   * @returns
   */
  checkPosition(position: Position) {
    const validX = position.x >= this.minX && position.x <= this.maxX;
    const validY = position.y >= this.minY && position.y <= this.maxY;
    return validX && validY;
  }

  /**
   * 校验后得出合法的位置集合
   *
   * @param position
   * @returns
   */
  loadPositions(positions: Position[]) {
    return positions.filter((position) => this.checkPosition(position));
  }

  /** 获取棋子显示名称 */
  abstract getName(): string;

  /** 获取棋子下一步可用的位置集合 */
  abstract getNextPositions(): Position[];

  // abstract move(position: Position): void;

  // abstract toNotation

  /** 移动棋子到下一位置 */
  move(position: Position) {
    if (this.side !== this.board.turn) {
      console.log(`[warn] not turn of ${this.side}`);
      return;
    }
    const nextPositions = this.getNextPositions();
    if (nextPositions.find((item) => isPositionEqual(item, position))) {
      this.board.removePiece(position);

      this.prevPosition = this.position;
      this.position = position;

      this.board.switch();
      emitter.emit('move', this);
    } else {
      console.log(`[warn] [${this.getName()}] at ${JSON.stringify(this.position)}: next position illegal.`);
    }
  }
}
