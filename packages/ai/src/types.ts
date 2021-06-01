import { Move as TheMove } from '@xiangqijs/core';

export type Move = Pick<TheMove, 'from' | 'to'>;

export type Result = Move | null;
