// Reaxxion/components/Map/Hexagon.jsx

import React from "react";
import useGameStore from "../../store/useGameStore";

const Hexagon = React.memo(({ hexKey, cx, cy, size, player, onClick }) => {
  const { getPlayerColor, selectedHex } = useGameStore();

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
