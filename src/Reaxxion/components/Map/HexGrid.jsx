// HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";
import useGameStore from "../../store/useGameStore";
import { Point } from "../../HexData/HexMath";

const HexGrid = React.memo(({ onHexClick }) => {
  const { mapStorage, mapLayout, board, boardSize } = useGameStore();

  console.log("mapStorage size:", mapStorage.size);
  console.log("board size:", board.size);
  console.log("boardSize:", boardSize);

  console.log("Board entries:");
  board.forEach((value, key) => {
    console.log(`Key: ${key}, Value: ${value}`);
  });

  const hexagons = useMemo(() => {
    if (!mapStorage || !mapLayout || !mapLayout.size || !board) {
      console.error(
        "mapStorage, mapLayout, or board is undefined or incomplete"
      );
      return [];
    }

    return Array.from(mapStorage.entries()).map(([key, hex]) => {
      let point, corners;
      try {
        point = mapLayout.hexToPixel(hex);
        corners = mapLayout.polygonCorners(hex);
      } catch (error) {
        console.error("Error calculating hex position:", error);
        point = new Point(0, 0);
        corners = [];
      }
      const owner = board.get(key);
      console.log(`Hex ${key} - Owner: ${owner}`);

      return {
        key,
        q: hex.q,
        r: hex.r,
        x: point ? point.x : 0,
        y: point ? point.y : 0,
        corners: corners.map((corner) => ({
          x: corner ? corner.x : 0,
          y: corner ? corner.y : 0,
        })),
        owner,
      };
    });
  }, [mapStorage, mapLayout, board]);

  if (hexagons.length === 0) {
    return (
      <div>
        No hexagons to display. Make sure the game is initialized properly.
      </div>
    );
  }

  // Calculate the SVG viewBox
  const minX = Math.min(...hexagons.map((h) => h.x));
  const minY = Math.min(...hexagons.map((h) => h.y));
  const maxX = Math.max(...hexagons.map((h) => h.x));
  const maxY = Math.max(...hexagons.map((h) => h.y));
  const viewBox = `${minX - 10} ${minY - 10} ${maxX - minX + 20} ${
    maxY - minY + 20
  }`;

  return (
    <svg width="100%" height="100%" viewBox={viewBox}>
      <g>
        {hexagons.map((hexProps) => (
          <Hexagon
            key={hexProps.key}
            q={hexProps.q}
            r={hexProps.r}
            x={hexProps.x}
            y={hexProps.y}
            corners={hexProps.corners}
            owner={hexProps.owner}
            onClick={() => onHexClick({ q: hexProps.q, r: hexProps.r })}
          />
        ))}
      </g>
    </svg>
  );
});

export default HexGrid;
