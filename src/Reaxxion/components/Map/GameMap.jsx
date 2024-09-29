// Reaxxion/components/Map/GameMap.jsx

import React, { useEffect, useState, useMemo, useCallback } from "react";
import HexGrid from "./HexGrid";
import useGameStore from "../../store/useGameStore";

const GameMap = ({ width = "100%", height = "100%" }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const {
    initializeGame,
    board,
    boardSize,
    currentPlayer,
    handleHexSelection,
    gameStatus,
    getScores,
    getPlayerColor,
    getGameResultMessage,
  } = useGameStore();

  useEffect(() => {
    initializeGame(7, 7); // Initialize a 7x7 board
  }, [initializeGame]);

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

  const handleHexClick = useCallback(
    (hexKey) => {
      if (gameStatus === "playing") {
        handleHexSelection(hexKey);
      }
    },
    [gameStatus, handleHexSelection]
  );

  const scores = getScores();

  return (
    <div>
      <div>
        <h2>Current Player: {getPlayerColor(currentPlayer)}</h2>
        <p>Red Score: {scores.player1}</p>
        <p>Blue Score: {scores.player2}</p>
      </div>
      {gameStatus === "finished" && <h3>{getGameResultMessage()}</h3>}
      <div id="hex-map-container" style={{ width, height }}>
        <HexGrid
          width={dimensions.width}
          height={dimensions.height}
          board={board}
          boardSize={boardSize}
          onHexClick={handleHexClick}
        />
      </div>
    </div>
  );
};

export default React.memo(GameMap);
