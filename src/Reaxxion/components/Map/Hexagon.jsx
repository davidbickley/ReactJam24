// Reaxxion/components/Map/Hexagon.jsx

/**
 * Hexagon component for rendering individual hexagons in the game grid.
 * This component is memoized for performance optimization.
 */

import React from "react";
import useGameStore from "../../store/useGameStore";

const Hexagon = React.memo(({ q, r, x, y, corners, owner, onClick }) => {
  const { mapLayout, getPlayerColor, isHexHighlighted } = useGameStore();

  const hexKey = `${q},${r}`;
  const isHighlighted = isHexHighlighted(hexKey);

  const pointsString = corners
    .map(
      (corner) =>
        `${isNaN(corner.x) ? 0 : corner.x},${isNaN(corner.y) ? 0 : corner.y}`
    )
    .join(" ");
  const fillColor = owner ? getPlayerColor(owner) : "white";
  const strokeColor = "black";
  const strokeWidth = 1;

  // TODO connect to the player
  const player = false;
  // const isSelected = selectedHex === hexKey; HexKey no longer exists

  return (
    //<g transform={`translate(${isNaN(x) ? 0 : x},${isNaN(y) ? 0 : y})`}>
    <polygon
      points={pointsString}
      fill={isHighlighted ? "yellow" : fillColor}
      stroke={isHighlighted ? "orange" : strokeColor}
      strokeWidth={isHighlighted ? 2 : strokeWidth}
      onClick={() => onClick({ q, r })}
    />
    //</g>
  );
});

export default Hexagon;
