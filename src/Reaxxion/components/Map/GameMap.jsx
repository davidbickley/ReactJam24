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
    viewport,
    initViewportListeners,
    getBoardSize,
    needsBoardReset,
    selectedHex
  } = useGameStore();

  useEffect(() => {
    initializeGame();
    const cleanupViewportListeners = initViewportListeners();
    return () => {
      cleanupViewportListeners();
    };
  }, [initializeGame, initViewportListeners]);

  useEffect(() => {
    const newBoardSize = getBoardSize();
    if (needsBoardReset(newBoardSize)) {
      initializeGame();
    }
  }, [viewport, getBoardSize, needsBoardReset, initializeGame]);

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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "5px",
          height: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Current Player: {getPlayerColor(currentPlayer)}</span>
        <span>
          Red: {scores.player1} | Blue: {scores.player2}
        </span>
        <span>
          Board: {boardSize.width}x{boardSize.height}
        </span>
        <span>
          Selected hex: {selectedHex}
        </span>
      </div>
      {gameStatus === "finished" ? (
        <div style={{ height: "20px", textAlign: "center" }}>
          {getGameResultMessage()}
        </div>
      ) : (
        <div style={{ height: "20px", textAlign: "center" }}>
          Game in progress
        </div>
      )}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <HexGrid
          width={viewport.width}
          height={viewport.height - 60}
          board={board}
          boardSize={boardSize}
          onHexClick={handleHexClick}
        />
      </div>
    </div>
  );
};

export default React.memo(GameMap);
