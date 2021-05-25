import React from 'react';

import { Position } from '@xiangqijs/react';
import { GRID_SIZE, PIECE_SIZE } from './constants';
import './PieceWrapper.css';

const PieceWrapper: React.FC<{
  position: Position;
  type?: 'placeholder' | 'piece';
  selected?: boolean;
  next?: boolean;
  moved?: boolean;
  onClick?: (position: Position) => void;
}> = (props) => {
  const { position, type = 'placeholder', selected, next, moved, onClick, children } = props;

  const isPieceType = type === 'piece';

  const getBackground = () => {
    if (next) {
      return '#ffef99';
    }
    return isPieceType ? 'gold' : 'unset';
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: (position.y - 1) * GRID_SIZE - PIECE_SIZE / 2,
        left: (position.x - 1) * GRID_SIZE - PIECE_SIZE / 2,
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        borderRadius: '50%',
        background: getBackground(),
        boxShadow: moved ? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : 'unset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      className={isPieceType && selected ? 'piece-selected' : ''}
      onClick={() => {
        onClick?.(position);
      }}
    >
      {children}
    </div>
  );
};

export default PieceWrapper;
