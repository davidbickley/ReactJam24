// src/components/Map/HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";

const HexGrid = React.memo(
  ({ width, height, board, boardSize, onHexClick }) => {
    const hexagons = useMemo(() => {
      const hexs = [];
      const gap = 16; // 1rem = 16px (assuming default font size)

      // Calculate hex size based on available space and board dimensions
      const hexWidth = (width - gap * (boardSize.width + 1)) / boardSize.width;
      const hexHeight =
        (height - gap * (boardSize.height * 0.75 + 0.25)) /
        (boardSize.height * 0.75 + 0.25);
      const hexSize = Math.min(hexWidth / 2, hexHeight / Math.sqrt(3));

      // Calculate grid dimensions
      const gridWidth = boardSize.width * (hexSize * 2 + gap) - gap;
      const gridHeight =
        (boardSize.height * 0.75 + 0.25) * (hexSize * Math.sqrt(3) + gap);

      // Center the grid
      const startX = (width - gridWidth) / 2 + hexSize;
      const startY = (height - gridHeight) / 2 + (hexSize * Math.sqrt(3)) / 2;

      for (let row = 0; row < boardSize.height; row++) {
        for (let col = 0; col < boardSize.width; col++) {
          const x = startX + col * (hexSize * 1.5 + gap);
          const y =
            startY +
            row * (hexSize * Math.sqrt(3) + gap) +
            (col % 2) * ((hexSize * Math.sqrt(3)) / 2 + gap / 2);
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

/**
 * Usage example:
 *
 * <HexGrid
 *   width={800}
 *   height={600}
 *   board={new Map([['0-0', 1], ['1-1', 2]])}
 *   boardSize={{ width: 7, height: 7 }}
 *   onHexClick={(key) => console.log(`Hexagon ${key} clicked`)}
 * />
 */
