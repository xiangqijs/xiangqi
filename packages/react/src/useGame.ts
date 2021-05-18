import { useRef, useState } from 'react';
import { Game } from '@xiangqijs/core';

const initGame = (forceUpdate: () => void) => {
  const game = new Game();
  game.on('move', () => {
    forceUpdate();
  });
  return game;
};

export default function useGame() {
  const [, forceUpdate] = useState({});
  const forceReRender = () => {
    forceUpdate({});
  };

  const gameRef = useRef<Game>(initGame(forceReRender));

  return gameRef.current;
}
