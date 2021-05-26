import { useRef, useState } from 'react';
import { Game } from '@xiangqijs/core';

const initGame = (forceUpdate: () => void) => {
  const game = new Game();
  game.on('move', () => {
    forceUpdate();
  });
  game.on('reset', () => {
    forceUpdate();
  });
  return game;
};

export default function useGame() {
  const gameRef = useRef<Game>();

  const [, forceUpdate] = useState({});
  const forceReRender = () => {
    forceUpdate({});
  };

  // ref: https://github.com/facebook/react/issues/14490#issuecomment-449729465
  //
  // can't use like: `const gameRef = useRef<Game>(initGame(forceReRender));`
  // it will mount more and more events on game.
  // caused forceReRender more and more.
  if (gameRef.current == null) {
    gameRef.current = initGame(forceReRender);
  }

  return gameRef.current;
}
