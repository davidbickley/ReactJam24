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
 * @param {number} props.q - first of 3 hex coords
 * @param {number} props.r - second of 3 hex coords
 * @param {Function} props.onClick - Click handler for the hexagon
 */
const Hexagon = React.memo(({ hexKey, q, r, onClick}) => {
  const { mapLayout, getPlayerColor, selectedHex } = useGameStore();

  // Calculate hexagon corner points
  const points = mapLayout.polygonCorners({q: q, r: r, s: -q - r}).map((point) => {
    return `${point.x},${point.y}`;
  })

  // TODO connect to the player
  const player = false;

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