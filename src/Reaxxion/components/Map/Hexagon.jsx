// Reaxxion/components/Map/Hexagon.jsx

/**
 * Hexagon component for rendering individual hexagons in the game grid.
 * This component is memoized for performance optimization.
 */

import React from "react";
import useGameStore from "../../store/useGameStore";
import { Layout } from "../../HexData/HexMath";

/**
 * @param {Object} props - Component props
 * @param {string} props.hexKey - Unique identifier for the hexagon
 * @param {number} props.q - first of 3 hex coords
 * @param {number} props.r - second of 3 hex coords
 * @param {number} props.size - Size of the hexagon
 * @param {number|null} props.player - Player occupying the hexagon (1, 2, or null)
 * @param {Function} props.onClick - Click handler for the hexagon
 * @param {Layout} props.layout - Hex layout data for corner point calculations
 */
const Hexagon = React.memo(({ hexKey, q, r, size, player, onClick, layout }) => {
  const { getPlayerColor, selectedHex } = useGameStore();

  // Calculate hexagon corner points
  const points = layout.polygonCorners({q: q, r: r, s: -q - r}).map((point) => {
    return `${point.x},${point.y}`;
  })

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
