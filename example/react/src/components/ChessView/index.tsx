import React from 'react';

import { Board, PieceBase, Type } from '@xiangqijs/react';
import PieceWrapper from './PieceWrapper';
import { GRID_SIZE } from './constants';

const ChessView = (props: { board: Board }) => {
  const { board } = props;

  const [currentPiece, setCurrentPiece] = React.useState<PieceBase>();
  const [prevPiece, setPrevPiece] = React.useState<PieceBase>();

  const verticalLinesCount = board.maxX - board.minX + 1;
  const horizontalLinesCount = board.maxY - board.minY + 1;

  return (
    <div style={{ display: 'inline-block', padding: GRID_SIZE * 1.5 }}>
      <div>
        {new Array(horizontalLinesCount - 1).fill(true).map((_, index) => {
          const customStyle: React.CSSProperties = {
            width: GRID_SIZE * (verticalLinesCount - 1),
            height: GRID_SIZE - 1,
            borderBottom: '1px solid black',
          };
          return (
            <div
              key={`horizontal-line-${index + 1}`}
              style={{
                ...customStyle,
                ...(index === 0 ? { borderTop: '1px solid black' } : {}),
              }}
            />
          );
        })}
      </div>
      <div style={{ position: 'relative', top: -(horizontalLinesCount - 1) * GRID_SIZE }}>
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

        {board.positions.map((position) => {
          const piece = board.findPiece(position);
          return (
            <PieceWrapper
              key={`${JSON.stringify(position)}`}
              position={position}
              type={piece ? 'piece' : 'placeholder'}
              next={currentPiece && currentPiece?.nextPositionsContain(position)}
              moved={prevPiece && piece === prevPiece}
              selected={piece === currentPiece}
              onClick={(position) => {
                if (board.pieces.filter((item) => item.type === Type.King).length < 2) {
                  return;
                }
                if (currentPiece?.nextPositionsContain(position)) {
                  currentPiece.moveTo(position);
                  setPrevPiece(currentPiece);
                  setCurrentPiece(undefined);
                  return;
                }
                if (piece && piece.side === board.turn) {
                  setCurrentPiece(piece);
                }
              }}
            >
              {piece && <span style={{ color: piece.side.toLowerCase() }}>{piece.getName()}</span>}
            </PieceWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default ChessView;
