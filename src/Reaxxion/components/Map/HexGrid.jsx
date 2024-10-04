import React, { useMemo } from "react";
import Hexagon from "./Hexagon";
import useGameStore from "../../store/useGameStore";

const HexGrid = React.memo(
  ({ width, height, board, boardSize, onHexClick }) => {
    const { mapLayout, mapStorage } = useGameStore();

    const hexagons = useMemo(() => {
      if (
        !mapLayout ||
        !boardSize ||
        boardSize.width === 0 ||
        boardSize.height === 0
      ) {
        console.log("Skipping hexagon generation due to missing data");
        return [];
      }

      console.log("Generating hexagons");
      const hexes = [];
      for (let q = 0; q < boardSize.height; q++) {
        for (let r = 0; r < boardSize.width; r++) {
          const key = `${q},${r}`;
          const s = mapStorage.getHex(q, r);
          const hexCoords = mapLayout.hexToPixel({ q, r, s });
          hexes.push(
            <Hexagon
              key={key}
              hexKey={key}
              q={q}
              r={r}
              s={s}
              x={hexCoords.x}
              y={hexCoords.y}
              onClick={() => onHexClick(key)}
            />
          );
        }
      }
      console.log(`Generated ${hexes.length} hexagons`);
      return hexes;
    }, [boardSize, mapLayout, mapStorage, onHexClick]);

    const viewBox = useMemo(() => {
      if (
        !mapLayout ||
        !boardSize ||
        boardSize.width === 0 ||
        boardSize.height === 0
      ) {
        return "0 0 100 100"; // Default viewBox
      }

      const topLeft = mapLayout.hexToPixel({ q: 0, r: 0 });
      const bottomRight = mapLayout.hexToPixel({
        q: boardSize.height - 1,
        r: boardSize.width - 1,
      });
      const padding = mapLayout.size.x;
      return `${topLeft.x - padding} ${topLeft.y - padding} ${
        bottomRight.x - topLeft.x + 2 * padding
      } ${bottomRight.y - topLeft.y + 2 * padding}`;
    }, [mapLayout, boardSize]);

    if (
      !mapLayout ||
      !boardSize ||
      boardSize.width === 0 ||
      boardSize.height === 0
    ) {
      return <div>Loading...</div>;
    }

    return (
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>{hexagons}</g>
      </svg>
    );
  }
);

export default HexGrid;
