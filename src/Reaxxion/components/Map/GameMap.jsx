// src/components/Map/GameMap.jsx

import React, { useEffect, useCallback } from "react";
import HexGrid from "./HexGrid";
import useGameStore from "../../store/useGameStore";

const GameMap = () => {
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
    highlightValidMoves,
    viewport,
    initViewportListeners,
    getOptimalBoardSize,
  } = useGameStore();

  useEffect(() => {
    initializeGame();
    const cleanupViewportListeners = initViewportListeners();
    return () => {
      cleanupViewportListeners();
    };
  }, [initializeGame, initViewportListeners]);

  useEffect(() => {
    const { width, height } = getOptimalBoardSize();
    if (width !== boardSize.width || height !== boardSize.height) {
      initializeGame();
    }
  }, [viewport, getOptimalBoardSize, boardSize, initializeGame]);

  const handleHexClick = useCallback(
    (hexKey) => {
      if (gameStatus === "playing") {
        handleHexSelection(hexKey);
        highlightValidMoves(hexKey);
      }
    },
    [gameStatus, handleHexSelection, highlightValidMoves]
  );

  const scores = getScores();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "10px" }}>
        <h2>Current Player: {getPlayerColor(currentPlayer)}</h2>
        <p>Red Score: {scores.player1}</p>
        <p>Blue Score: {scores.player2}</p>
        <p>Orientation: {viewport.orientation}</p>
        <p>
          Board Size: {boardSize.width}x{boardSize.height}
        </p>
      </div>
      {gameStatus === "finished" && <h3>{getGameResultMessage()}</h3>}
      <div style={{ flex: 1, overflow: "hidden", padding: "1rem" }}>
        <HexGrid
          width={viewport.width - 32} // Subtract 2rem (32px) to account for padding
          height={viewport.height - 150} // Subtract approximate height of the score area and additional info
          board={board}
          boardSize={boardSize}
          onHexClick={handleHexClick}
        />
      </div>
    </div>
  );
};

export default React.memo(GameMap);
