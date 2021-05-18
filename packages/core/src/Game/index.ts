import Board from '../Board';
import emitter, { Events } from '../emitter';

export default class Game {
  board = new Board();

  history = [];

  on<E extends keyof Events>(event: E, callback: Events[E]) {
    return emitter.on(event, callback);
  }
}
