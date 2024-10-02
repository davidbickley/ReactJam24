// src/components/Map/Hexagon.jsx

import React, { useMemo } from "react";
import useGameStore from "../../store/useGameStore";
import Marker from "../Marker/Marker";

const Hexagon = React.memo(({ hexKey, cx, cy, size, player, onClick }) => {
  const { getPlayerColor, selectedHex, isHexHighlighted } = useGameStore();

  const points = useMemo(() => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 3;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [cx, cy, size]);

  const isSelected = selectedHex === hexKey;
  const isHighlighted = isHexHighlighted(hexKey);
  const fillColor = player ? getPlayerColor(player) : "white";
  const strokeColor = isSelected ? "yellow" : "black";
  const strokeWidth = isSelected ? 3 : 1;

  const highlightFill = isHighlighted ? "rgba(144, 238, 144, 0.5)" : fillColor;
  const highlightStroke = isHighlighted ? "black" : strokeColor;

  // Calculate the position for the Marker
  const markerX = cx - size / 2;
  const markerY = cy - size / 2;

  return (
    // Wrap the polygon and Marker in a group (g) element
    <g onClick={onClick}>
      <polygon
        points={points}
        fill={highlightFill}
        stroke={highlightStroke}
        strokeWidth={strokeWidth}
      />
      {/* Render the Marker component if a player has claimed this hex */}
      {player && (
        <foreignObject x={markerX} y={markerY} width={size} height={size}>
          <Marker player={player} size={size} />
        </foreignObject>
      )}
    </g>
  );
});

export default Hexagon;
