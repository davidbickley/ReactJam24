// src/components/Map/HexGrid.jsx

import React, { useMemo } from "react";
import Hexagon from "./Hexagon";
import useGameStore from "../../store/useGameStore";

const HexGrid = React.memo((onHexClick) => {
  const {
    mapStorage,
    boardSize
  } = useGameStore();

  return (
    <svg width={boardSize.width} height={boardSize.height}>
      <g>
        {
          mapStorage.keys().map((key) => {
            <Hexagon
              key={`${key.q}-${key.r}`}
              hexKey={`${key.q}-${key.r}`}
              q={key.q}
              r={key.r}
              onClick={() => onHexClick(key)}
            />
          })
        }
      </g>
    </svg>
  )
});

export default HexGrid;
