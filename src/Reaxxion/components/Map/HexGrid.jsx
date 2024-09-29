// Reaxxion/components/Map/HexGrid.jsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Hexagon from "./Hexagon";

const MAX_HEXAGONS = 2000;

const HexGrid = React.memo(({ width, height }) => {
  const [gridState, setGridState] = useState({
    hexSize: 0,
    gridWidth: 0,
    gridHeight: 0,
  });

  const calculateGrid = useCallback(() => {
    const hexHeight = Math.floor(height / 20);
    const hexWidth = (2 / Math.sqrt(3)) * hexHeight;

    // Calculate the number of hexagons that can fit
    const horizontalHexes = Math.floor(width / (hexWidth * 0.75));
    const verticalHexes = Math.floor(height / (hexHeight * 0.866));

    // Ensure we don't exceed MAX_HEXAGONS
    const totalHexagons = horizontalHexes * verticalHexes;
    const scaleFactor =
      totalHexagons > MAX_HEXAGONS
        ? Math.sqrt(MAX_HEXAGONS / totalHexagons)
        : 1;

    const finalHexSize = hexHeight * scaleFactor;

    setGridState({
      hexSize: finalHexSize,
      gridWidth: horizontalHexes,
      gridHeight: verticalHexes,
    });
  }, [width, height]);

  useEffect(() => {
    calculateGrid();
  }, [calculateGrid]);

  const hexagons = useMemo(() => {
    const { hexSize, gridWidth, gridHeight } = gridState;
    const hexs = [];
    const hexWidth = hexSize * Math.sqrt(3);
    const hexHeight = hexSize * 2;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const x = col * hexWidth * 1;
        const y = row * hexHeight * 1 + (col % 2 === 1 ? hexHeight * 0.433 : 0);
        hexs.push({ key: `${row}-${col}`, cx: x, cy: y });
      }
    }
    return hexs;
  }, [gridState]);

  return (
    <svg width={width} height={height}>
      <g>
        {hexagons.map(({ key, cx, cy }) => (
          <Hexagon
            key={key}
            hexKey={key}
            cx={cx}
            cy={cy}
            size={gridState.hexSize}
            width={width}
            height={height}
          />
        ))}
      </g>
    </svg>
  );
});

export default HexGrid;
