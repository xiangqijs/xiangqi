import { createNanoEvents } from 'nanoevents';
import type { Emitter } from 'nanoevents';

import { Base } from './Pieces';

export interface Events {
  move: (piece: Base) => void;
}

const emitter = createNanoEvents<Events>();

export default emitter;

export type { Emitter };
