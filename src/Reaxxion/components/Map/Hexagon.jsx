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
const Hexagon = React.memo(({ hexKey, q, r, onClick }) => {
  const { mapLayout, getPlayerColor, selectedHex } = useGameStore();

  if (!mapLayout) {
    console.error("mapLayout is undefined");
    return null;
  }

  console.log("mapLayout:", mapLayout); // Debug log

  // Calculate hexagon corner points
  let corners;
  try {
    corners = mapLayout.polygonCorners({ q, r, s: -q - r });
  } catch (error) {
    console.error("Error calculating polygon corners:", error);
    return null;
  }

  console.log("corners:", corners); // Debug log

  if (!Array.isArray(corners)) {
    console.error("corners is not an array:", corners);
    return null;
  }

  const points = corners.map((point) => {
    if (!point || typeof point.x !== "number" || typeof point.y !== "number") {
      console.error("Invalid point:", point);
      return "0,0"; // Fallback to origin if point is invalid
    }
    return `${point.x},${point.y}`;
  });

  console.log("points:", points); // Debug log

  const pointsString = points.join(" ");

  console.log("pointsString:", pointsString); // Debug log

  // TODO connect to the player
  const player = false;
  const isSelected = selectedHex === hexKey;
  const fillColor = player ? getPlayerColor(player) : "white";
  const strokeColor = isSelected ? "yellow" : "black";
  const strokeWidth = isSelected ? 3 : 1;

  return (
    <polygon
      points={pointsString}
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
