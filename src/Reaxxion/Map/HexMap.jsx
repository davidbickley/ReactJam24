import React, { useEffect, useState } from "react";

const HexGrid = ({ width, height, gridWidth, gridHeight }) => {
  const [hexSize, setHexSize] = useState(0);
  const [viewBox, setViewBox] = useState("0 0 0 0");

  useEffect(() => {
    const calculateHexSize = () => {
      const hexWidth = width / ((gridWidth + 0.5) * Math.sqrt(3));
      const hexHeight = height / ((gridHeight * 2 + 1) * 0.75);
      return Math.min(hexWidth, hexHeight);
    };

    const newHexSize = calculateHexSize();
    setHexSize(newHexSize);

    const totalWidth = (gridWidth + 0.5) * Math.sqrt(3) * newHexSize;
    const totalHeight = (gridHeight * 2 + 1) * 0.75 * newHexSize;
    setViewBox(`0 0 ${totalWidth} ${totalHeight}`);
  }, [width, height, gridWidth, gridHeight]);

  const hexagons = [];

  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      const x = (col + 0.5 * (row % 2)) * Math.sqrt(3) * hexSize;
      const y = row * 1.5 * hexSize;

      hexagons.push(
        <Hexagon key={`${row}-${col}`} cx={x} cy={y} size={hexSize} />
      );
    }
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>{hexagons}</g>
    </svg>
  );
};

const Hexagon = ({ cx, cy, size }) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 2;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <polygon
      points={points.join(" ")}
      fill="white"
      stroke="black"
      strokeWidth="1"
    />
  );
};

const HexMap = ({
  width = "100%",
  height = "100%",
  gridWidth = 10,
  gridHeight = 10,
}) => {
  return (
    <div style={{ width, height }}>
      <HexGrid
        width={typeof width === "number" ? width : 800}
        height={typeof height === "number" ? height : 600}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
      />
    </div>
  );
};

export default HexMap;
