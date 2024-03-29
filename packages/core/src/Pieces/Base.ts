import Board from '../Board';
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

export interface DumpedPiece {
  type: Type;
  side: Side;
  position: Position;
}

export interface Position {
  x: number;
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
  /** 棋子 x 轴最小值 */
  minX = 1;

  /** 棋子 x 轴最大值 */
  maxX = 9;

  /** 棋子 y 轴最小值 */
  minY = 1;

  /** 棋子 y 轴最大值 */
  maxY = 10;
}

export class PositionInteraction extends Limit {
  x: number;
  y: number;

  constructor(position: Position) {
    super();
    this.x = position.x;
    this.y = position.y;
  }

  static load(position: Position) {
    return new PositionInteraction(position);
  }

  clone() {
    return new PositionInteraction(this.dump());
  }

  equal(position: Position | PositionInteraction) {
    return this.x === position.x && this.y === position.y;
  }

  valid() {
    const validX = this.x >= this.minX && this.x <= this.maxX;
    const validY = this.y >= this.minY && this.y <= this.maxY;
    return validX && validY;
  }

  // 位置上移
  top(distance = 1) {
    this.y = this.y - distance;
    return this;
  }

  // 位置右移
  right(distance = 1) {
    this.x = this.x + distance;
    return this;
  }

  // 位置下移
  bottom(distance = 1) {
    this.top(-distance);
    return this;
  }

  // 位置左移
  left(distance = 1) {
    this.right(-distance);
    return this;
  }

  dump() {
    return {
      x: this.x,
      y: this.y,
    };
  }
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

  /**
   * 棋子上次的位置
   *
   * 注意，当棋子正常移动时可得到正常的位置信息，
   * 如果通过 undo 操作时，该值为 undefined；
   * 如果通过 redo 操作时，该值为 from 指定的 Position；
   */
  prevPosition?: Position;

  position: Position;

  constructor(options: PieceBaseOptions) {
    super();

    this.board = options.board;
    this.type = options.type;
    this.side = options.side;
    this.initPosition = options.initPosition;
    this.position = options.initPosition;
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

  /** 获取棋子显示名称 */
  abstract getName(): string;

  /** 获取棋子下一步可用的位置集合 */
  abstract getNextPositions(): Position[];

  // [FEN(福斯夫－爱德华兹记号法)]表示符
  getFENChar() {
    const char = this.type.charAt(0);
    return this.side === Side.Red ? char : char.toLowerCase();
  }

  dump(): DumpedPiece {
    return {
      type: this.type,
      side: this.side,
      position: this.position,
    };
  }
}
