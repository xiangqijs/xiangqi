import React, { useRef, useState, useEffect } from 'react';

import { useGame, Side, Type } from '@xiangqijs/react';
import { random as randomAI, minimax as minimaxAI } from '@xiangqijs/ai';

import ChessView, { ActionType } from './components/ChessView';

enum PlayerType {
  Player,
  RandomAI,
  MinimaxAI,
  AlphaBetaAI,
}

const playerOptions = [
  { value: PlayerType.Player, label: '玩家' },
  { value: PlayerType.RandomAI, label: 'AI (random)' },
  { value: PlayerType.MinimaxAI, label: 'AI (minimax)' },
  { value: PlayerType.AlphaBetaAI, label: 'AI (alpha–beta)', disabled: true },
];

function actions(fns: (() => void)[], options?: { index?: number; onEnd?: () => void }) {
  const { index = 0, onEnd } = options || {};
  console.log('call action', index);
  fns[index]();
  console.log('call action end', index);
  if (index + 1 < fns.length) {
    setTimeout(() => {
      actions(fns, { index: index + 1, onEnd });
    }, 800);
  }
  if (index + 1 === fns.length) {
    onEnd?.();
  }
}

export default () => {
  const game = useGame();
  const actionRef = useRef<ActionType>();
  const [moving, setMoving] = useState(false);
  const [redPlayer, setRedPlayer] = useState(PlayerType.Player);
  const [blackPlayer, setBlackPlayer] = useState(PlayerType.MinimaxAI);

  const handleAI = (type: 'random' | 'minimax') => {
    setMoving(true);
    const fn = type === 'random' ? randomAI : minimaxAI;
    const move = fn(game.board);
    if (move) {
      console.log(
        `handleAI move: ${game.board.findPiece(move.from)?.getName()} ${JSON.stringify(move.from)} => ${JSON.stringify(
          move.to
        )}`
      );
      actions([() => actionRef.current?.click(move.from), () => actionRef.current?.click(move.to)], {
        onEnd: () => setMoving(false),
      });
    } else {
      setMoving(false);
      alert(`${game.board.turn === Side.Red ? '红方' : '黑方'} 认输！`);
    }
  };

  const handleSwitch = (turn: Side) => {
    setTimeout(() => {
      if (turn === Side.Red) {
        // 红方非普通玩家
        switch (redPlayer) {
          case PlayerType.RandomAI:
            handleAI('random');
            return;
          case PlayerType.MinimaxAI:
            handleAI('minimax');
            return;
          default:
            return;
        }
      } else {
        // 黑方非普通玩家
        switch (blackPlayer) {
          case PlayerType.RandomAI:
            handleAI('random');
            return;
          case PlayerType.MinimaxAI:
            handleAI('minimax');
            return;
          default:
            return;
        }
      }
    });
  };

  useEffect(() => {
    const unbind = game.on('switch', handleSwitch);
    return () => unbind();
  }, [redPlayer, blackPlayer]);

  useEffect(() => {
    if (!game.board.end()) {
      handleSwitch(game.board.turn);
    }
  }, [redPlayer, blackPlayer]);

  const getWinSide = () => {
    if (!game.board.pieces.some((item) => item.type === Type.King && item.side === Side.Black)) {
      return Side.Red;
    }
    if (!game.board.pieces.some((item) => item.type === Type.King && item.side === Side.Red)) {
      return Side.Black;
    }
    return null;
  };

  const getTitle = () => {
    const winSide = getWinSide();
    if (!winSide) {
      return `${game.board.turn === Side.Red ? '红方' : '黑方'}着手`;
    }
    return `${winSide === Side.Red ? '红方' : '黑方'}获胜!`;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginTop: 24 }}>
        <span>{getTitle()}</span>
      </div>
      <div>
        <span>{moving ? 'running...' : 'idle...'}</span>
      </div>
      <ChessView board={game.board} actionRef={actionRef} />
      <div>
        <label>红方</label>&nbsp;
        <select value={redPlayer} onChange={(event) => setRedPlayer(Number(event.target.value))}>
          {playerOptions.map((item) => {
            return (
              <option key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </option>
            );
          })}
        </select>
        &nbsp;&nbsp;
        <label>黑方</label>&nbsp;
        <select value={blackPlayer} onChange={(event) => setBlackPlayer(Number(event.target.value))}>
          {playerOptions.map((item) => {
            return (
              <option key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
      <hr />
      <div>
        <label>Next move by AI:</label>&nbsp;
        <button disabled={moving} onClick={() => handleAI('random')}>
          random
        </button>
        &nbsp;
        <button disabled={moving} onClick={() => handleAI('minimax')}>
          minimax
        </button>
        &nbsp;
        <button disabled>alpha–beta (coming soon)</button>
      </div>
      <hr />
      <div>
        <button onClick={() => game.board.reset()} disabled={moving}>
          重新开始
        </button>
        &nbsp;
        <button disabled={!game.board.canUndo() || moving} onClick={() => game.board.undo()}>
          Undo
        </button>
        &nbsp;
        <button disabled={!game.board.canRedo() || moving} onClick={() => game.board.redo()}>
          Redo
        </button>
      </div>
    </div>
  );
};
