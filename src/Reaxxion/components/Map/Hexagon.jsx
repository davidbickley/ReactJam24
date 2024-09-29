// Reaxxion/components/Map/Hexagon.jsx

/**
 * Hexagon component for rendering individual hexagons in the game grid.
 * This component is memoized for performance optimization.
 */

import React from "react";
import useGameStore from "../../store/useGameStore";

/**
 * @param {Object} props - Component props
 * @param {string} props.hexKey - Unique identifier for the hexagon
 * @param {number} props.cx - X-coordinate of the hexagon's center
 * @param {number} props.cy - Y-coordinate of the hexagon's center
 * @param {number} props.size - Size of the hexagon
 * @param {number|null} props.player - Player occupying the hexagon (1, 2, or null)
 * @param {Function} props.onClick - Click handler for the hexagon
 */
const Hexagon = React.memo(({ hexKey, cx, cy, size, player, onClick }) => {
  const { getPlayerColor, selectedHex } = useGameStore();

  // Generate hexagon points
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  const isSelected = selectedHex === hexKey;
  const fillColor = player ? getPlayerColor(player) : "white";
  const strokeColor = isSelected ? "yellow" : "black";
  const strokeWidth = isSelected ? 3 : 1;

  return (
    <polygon
      points={points.join(" ")}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={onClick}
    />
  );
});

export default Hexagon;

// Usage example:
// <Hexagon
//   hexKey="0-0"
//   cx={100}
//   cy={100}
//   size={50}
//   player={1}
//   onClick={() => handleHexClick("0-0")}
// />
