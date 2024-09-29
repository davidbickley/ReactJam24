// Reaxxion/components/Map/GameMap

import React, { useEffect, useState, useMemo, useCallback } from "react";
import HexGrid from "./HexGrid";

const GameMap = ({ width = "100%", height = "100%" }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("hex-map-container");
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div id="hex-map-container" style={{ width, height }}>
      <HexGrid width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default React.memo(GameMap);
