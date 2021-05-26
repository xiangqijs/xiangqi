import React, { useRef } from 'react';

import { useGame, Side, Type } from '@xiangqijs/react';
import { random as randomAI } from '@xiangqijs/ai';

import ChessView, { ActionType } from './components/ChessView';

function actions(fns: (() => void)[], index = 0) {
  fns[index]();
  if (index + 1 < fns.length) {
    setTimeout(() => {
      actions(fns, index + 1);
    }, 640);
  }
}

export default () => {
  const game = useGame();
  const actionRef = useRef<ActionType>();

  const handleRandomAI = () => {
    const move = randomAI(game.board);
    if (move) {
      console.log(`move: ${JSON.stringify(move.current)} => ${JSON.stringify(move.next)}`);
      actions([() => actionRef.current?.click(move.current), () => actionRef.current?.click(move.next)]);
    } else {
      alert(`${game.board.turn === Side.Red ? '红方' : '黑方'} 认输！`);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginTop: 24 }}>
        <span style={{ marginRight: 12 }}>{game.board.turn === Side.Red ? '红方' : '黑方'}着手中...</span>
        <button onClick={() => game.board.reset()}>重置</button>
      </div>
      <ChessView board={game.board} actionRef={actionRef} />
      <div>
        <label>Next move by AI:</label>&nbsp;
        <button onClick={handleRandomAI}>random</button>
      </div>
      {game.board.pieces.filter((item) => item.type === Type.King).length < 2 && <div>游戏结束</div>}
    </div>
  );
};
