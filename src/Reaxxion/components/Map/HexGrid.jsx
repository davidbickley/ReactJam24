// Reaxxion/components/Map/HexGrid.jsx

/**
 * HexGrid component for rendering the game board.
 * This component is memoized for performance optimization.
 */

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";
import { MapStorage } from "../../HexData/MapStorage";
import { Layout, Point } from "../../HexData/HexMath";

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

    const hexSize = Math.min(
      width / (boardSize.width * 2),
      height / (boardSize.height * 1.5)
    );

    const mapStorage = new MapStorage(Layout.flat, { x: hexSize, y: hexSize }, new Point(0, 0));
    mapStorage.createMap(boardSize);

    return (
      <svg width={width} height={height}>
        <g>
          {
            [...mapStorage.hexHash.keys()].map((key) => (
              // A key is an object with a q and an r
              <Hexagon
                key={`${key.q}-${key.r}`}
                hexKey={`${key.q}-${key.r}`}
                cx={mapStorage.hexLayout.hexToPixel({ q: key.q, r: key.r, s: -key.q - key.r}).x}
                cy={mapStorage.hexLayout.hexToPixel({ q: key.q, r: key.r, s: -key.q - key.r}).y}
                size={mapStorage.hexLayout.size}
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
