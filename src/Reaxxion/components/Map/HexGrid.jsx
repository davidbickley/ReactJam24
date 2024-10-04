// src/components/Map/HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";
import useGameStore from "../../store/useGameStore";
import { Hex, Point } from "../../HexData/HexMath";

const HexGrid = React.memo(({ onHexClick }) => {
  const { mapStorage, mapLayout, board, boardSize } = useGameStore();

  console.log("mapStorage:", mapStorage);
  console.log("mapLayout:", mapLayout);
  console.log("board:", board);
  console.log("boardSize:", boardSize);

  const hexagons = useMemo(() => {
    if (
      !mapStorage ||
      !mapLayout ||
      !mapLayout.size ||
      !mapLayout.size.x ||
      !mapLayout.size.y
    ) {
      console.error("mapStorage or mapLayout is undefined or incomplete");
      return [];
    }

    return Array.from(mapStorage.keys()).map((key) => {
      const hex = new Hex(key.q, key.r, -key.q - key.r);
      let point, corners;
      try {
        point = mapLayout.hexToPixel(hex);
        corners = mapLayout.polygonCorners(hex);
      } catch (error) {
        console.error("Error calculating hex position:", error);
        point = new Point(0, 0);
        corners = [];
      }
      const owner = board.get(key) || 0;

      return {
        key: `${key.q}-${key.r}`,
        q: key.q,
        r: key.r,
        x: point.x,
        y: point.y,
        corners: corners,
        owner: owner,
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
            {...hexProps}
            onClick={() => onHexClick({ q: hexProps.q, r: hexProps.r })}
          />
        ))}
      </g>
    </svg>
  );
});

export default HexGrid;
