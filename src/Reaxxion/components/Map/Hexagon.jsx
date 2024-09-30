// src/components/Map/Hexagon.jsx

import React, { useMemo } from "react";
import useGameStore from "../../store/useGameStore";

const Hexagon = React.memo(({ hexKey, cx, cy, size, player, onClick }) => {
  const { getPlayerColor, selectedHex, isHexHighlighted } = useGameStore();

  const points = useMemo(() => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 3; // Add PI/6 (30 degrees) for flat-top orientation
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [cx, cy, size]);

  const isSelected = selectedHex === hexKey;
  const isHighlighted = isHexHighlighted(hexKey);
  const fillColor = player ? getPlayerColor(player) : "white";
  const strokeColor = isSelected
    ? "yellow"
    : isHighlighted
    ? "lightgreen"
    : "black";
  const strokeWidth = isSelected || isHighlighted ? 3 : 1;

  return (
    <polygon
      points={points}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={onClick}
    />
  );
});

export default Hexagon;

/**
 * Usage example:
 *
 * <Hexagon
 *   hexKey="0-0"
 *   cx={100}
 *   cy={100}
 *   size={50}
 *   player={1}
 *   onClick={() => console.log("Hexagon clicked")}
 * />
 */
