import Board from '../Board';
import emitter, { Events } from '../emitter';

export default class Game {
  board = new Board();

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return emitter.on(event, callback);
  }
}

/**
 * 象棋比赛规例：https://www.xqbase.com/protocol/rule_asian.htm
 */
