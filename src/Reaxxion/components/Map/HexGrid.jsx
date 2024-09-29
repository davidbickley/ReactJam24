// Reaxxion/components/Map/HexGrid.jsx

/**
 * HexGrid component for rendering the game board.
 * This component is memoized for performance optimization.
 */

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";

/**
 * @typedef {Object} BoardSize
 * @property {number} width - Number of columns in the grid
 * @property {number} height - Number of rows in the grid
 */

/**
 * @param {Object} props - Component props
 * @param {number} props.width - Width of the SVG container
 * @param {number} props.height - Height of the SVG container
 * @param {Map<string, number>} props.board - Game board state
 * @param {BoardSize} props.boardSize - Dimensions of the game board
 * @param {Function} props.onHexClick - Click handler for hexagons
 */
const HexGrid = React.memo(
  ({ width, height, board, boardSize, onHexClick }) => {
    /**
     * Calculate hexagon positions and sizes based on board dimensions.
     * @type {Array<{key: string, cx: number, cy: number, size: number}>}
     */
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
