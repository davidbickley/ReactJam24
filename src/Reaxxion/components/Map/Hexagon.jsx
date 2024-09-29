import React, { useMemo, useState } from "react";
import useHexStore from "../../store/useHexStore";

const Hexagon = React.memo(({ hexKey, cx, cy, size, width, height }) => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleHex = useHexStore((state) => state.toggleHex);
  const isClicked = useHexStore((state) => state.clickedHexes.has(hexKey));

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      pts.push({ x, y });
    }
    return pts;
  }, [cx, cy, size]);

  const isVisible = useMemo(() => {
    return points.every(
      (point) =>
        point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height
    );
  }, [points, width, height]);

  if (!isVisible) {
    return null;
  }

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  const handleClick = () => {
    toggleHex(hexKey);
  };

  const fillColor = isClicked ? "blue" : isHovered ? "lightgray" : "white";

  return (
    <polygon
      points={pointsString}
      fill={fillColor}
      stroke="black"
      strokeWidth="1"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
});

export default Hexagon;
