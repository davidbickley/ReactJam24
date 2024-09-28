import React, { useEffect, useState, useMemo, useCallback } from "react";

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

const Hexagon = React.memo(({ cx, cy, size, width, height }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      pts.push({ x, y });
    }
    return pts;
  }, [cx, cy, size]);

  // Check if any point of the hexagon is outside the screen
  const isVisible = useMemo(() => {
    return points.every(
      (point) =>
        point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height
    );
  }, [points, width, height]);

  if (!isVisible) {
    return null;
  }

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <polygon points={pointsString} fill="none" stroke="black" strokeWidth="1" />
  );
});

const HexMap = ({ width = "100%", height = "100%" }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("hex-map-container");
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div id="hex-map-container" style={{ width, height }}>
      <HexGrid width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default React.memo(HexMap);
