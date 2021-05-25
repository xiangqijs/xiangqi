import React, { useRef } from 'react';

import { useGame, Side, Type } from '@xiangqijs/react';
import ChessView, { ActionType } from './components/ChessView';

export default () => {
  const game = useGame();
  const actionRef = useRef<ActionType>();

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginTop: 24 }}>
        <span style={{ marginRight: 12 }}>{game.board.turn === Side.Red ? '红方' : '黑方'}着手中...</span>
        <button onClick={() => game.board.reset()}>重置</button>
      </div>
      <ChessView board={game.board} actionRef={actionRef} />
      {game.board.pieces.filter((item) => item.type === Type.King).length < 2 && <div>游戏结束</div>}
    </div>
  );
};
