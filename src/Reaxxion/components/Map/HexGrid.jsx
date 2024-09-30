// src/components/Map/HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";

const HexGrid = React.memo(
  ({ width, height, board, boardSize, onHexClick }) => {
    const hexagons = useMemo(() => {
      const hexs = [];
      const padding = 20; // Padding around the grid
      const availableWidth = width - 2 * padding;
      const availableHeight = height - 2 * padding;

      // Calculate hex size to fit the screen, with a more aggressive reduction factor
      const reductionFactor = 0.7; // Reduce size by 30% to ensure all hexagons fit
      const hexWidth =
        (availableWidth / (boardSize.width * 0.75 + 0.25)) * reductionFactor;
      const hexHeight =
        (availableHeight / (boardSize.height * 0.5 + 0.5)) * reductionFactor;
      const hexSize = Math.min(hexWidth / 2, hexHeight / Math.sqrt(3));

      // Calculate grid dimensions
      const gridWidth = boardSize.width * hexSize * 1.5 + hexSize / 2;
      const gridHeight =
        boardSize.height * hexSize * Math.sqrt(3) * 0.75 +
        (hexSize * Math.sqrt(3)) / 4;

      // Center the grid
      const startX = (width - gridWidth) / 2 + hexSize;
      const startY = (height - gridHeight) / 5 + (hexSize * Math.sqrt(3)) / 2;

      for (let row = 0; row < boardSize.height; row++) {
        for (let col = 0; col < boardSize.width; col++) {
          const x = startX + col * hexSize * 1.5;
          const y =
            startY +
            row * hexSize * Math.sqrt(3) * 1 +
            (col % 2) * ((hexSize * Math.sqrt(3)) / 2);
          const key = `${row}-${col}`;
          hexs.push({ key, cx: x, cy: y, size: hexSize });
        }
      }
      return hexs;
    }, [width, height, boardSize]);

    return (
      <svg width={width} height={height}>
        <g>
          {hexagons.map(({ key, cx, cy, size }) => (
            <Hexagon
              key={key}
              hexKey={key}
              cx={cx}
              cy={cy}
              size={size}
              player={board.get(key)}
              onClick={() => onHexClick(key)}
            />
          ))}
        </g>
      </svg>
    );
  }
);

export default HexGrid;
