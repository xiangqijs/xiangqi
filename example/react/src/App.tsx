import React from 'react';

import { useGame } from '../../../packages/react';
import { Board, Base } from '../../../packages/core';
import type { Position } from '../../../packages/core/dist/Pieces/Base';
import './App.css';

const GRID_SIZE = 48;
const PIECE_SIZE = 40;

const PieceWrapper: React.FC<{
  position: Position;
  type?: 'placeholder' | 'piece';
  selected?: boolean;
  onClick?: (position: Position) => void;
}> = (props) => {
  const { position, type = 'placeholder', selected, onClick, children } = props;

  const isPieceType = type === 'piece';

  return (
    <div
      style={{
        position: 'absolute',
        top: (position.y - 1) * GRID_SIZE - PIECE_SIZE / 2,
        left: (position.x - 1) * GRID_SIZE - PIECE_SIZE / 2,
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        borderRadius: '50%',
        background: isPieceType ? 'gold' : 'unset',
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

const BoardView = (props: { board: Board }) => {
  const { board } = props;

  const [currentPiece, setCurrentPiece] = React.useState<Base>();
  const verticalLinesCount = board.maxX - board.minX + 1;
  const horizontalLinesCount = board.maxY - board.minY + 1;

  return (
    <div style={{ position: 'relative' }}>
      {new Array(verticalLinesCount).fill(true).map((_, index) => {
        const isFirstOrLastLine = index === 0 || index + 1 === verticalLinesCount;

        if (isFirstOrLastLine) {
          return (
            <div
              key={`vertical-line-${index + 1}`}
              style={{
                position: 'absolute',
                top: 0,
                left: GRID_SIZE * index,
                height: GRID_SIZE * (horizontalLinesCount - 1),
                borderRight: '1px solid black',
              }}
            />
          );
        }

        return (
          <React.Fragment key={`vertical-line-${index + 1}`}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: GRID_SIZE * index,
                height: GRID_SIZE * (horizontalLinesCount / 2 - 1),
                borderRight: '1px solid black',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: GRID_SIZE * 5,
                left: GRID_SIZE * index,
                height: GRID_SIZE * (horizontalLinesCount / 2 - 1),
                borderRight: '1px solid black',
              }}
            />
          </React.Fragment>
        );
      })}
      {new Array(horizontalLinesCount).fill(true).map((_, index) => {
        return (
          <div
            key={`horizontal-line-${index + 1}`}
            style={{
              position: 'absolute',
              top: GRID_SIZE * index,
              left: 0,
              width: 48 * (verticalLinesCount - 1),
              borderBottom: '1px solid black',
            }}
          />
        );
      })}
      {board.positions.map((position) => {
        const piece = board.findPiece(position);
        return (
          <PieceWrapper
            key={`${JSON.stringify(position)}`}
            position={position}
            type={piece ? 'piece' : 'placeholder'}
            selected={piece === currentPiece}
            onClick={(position) => {
              if (currentPiece?.nextPositionsContain(position)) {
                currentPiece.move(position);
                return;
              }
              if (piece) {
                setCurrentPiece(piece);
              }
            }}
          >
            {piece && <span style={{ color: piece.side.toLowerCase() }}>{piece.getName()}</span>}
          </PieceWrapper>
        );
      })}
    </div>
  );
};

export default () => {
  const game = useGame();

  return (
    <div style={{ marginTop: GRID_SIZE, marginLeft: GRID_SIZE }}>
      <BoardView board={game.board} />
    </div>
  );
};
