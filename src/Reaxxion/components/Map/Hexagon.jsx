import React from "react";
import useGameStore from "../../store/useGameStore";

const Hexagon = React.memo(({ hexKey, q, r, s, x, y, onClick }) => {
  const { mapLayout, getPlayerColor, board, isHexHighlighted } = useGameStore();

  const points = mapLayout
    .polygonCorners({ q, r, s })
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const player = board.get(hexKey);
  const fillColor = player ? getPlayerColor(player) : "white";
  const strokeColor = isHexHighlighted(hexKey) ? "yellow" : "black";
  const strokeWidth = isHexHighlighted(hexKey) ? 3 : 1;

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
