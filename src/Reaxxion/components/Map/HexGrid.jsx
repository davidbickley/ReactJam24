// Reaxxion/components/Map/HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";

const HexGrid = React.memo(
  ({ width, height, board, boardSize, onHexClick }) => {
    const hexagons = useMemo(() => {
      const hexs = [];
      const hexSize = Math.min(
        width / (boardSize.width * 2),
        height / (boardSize.height * 1.5)
      );
      const hexWidth = hexSize * Math.sqrt(3);
      const hexHeight = hexSize * 2;

      for (let row = 0; row < boardSize.height; row++) {
        for (let col = 0; col < boardSize.width; col++) {
          const x = col * hexWidth * 1;
          const y =
            row * hexHeight * 1 + (col % 2 === 1 ? hexHeight * 0.433 : 0);
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
