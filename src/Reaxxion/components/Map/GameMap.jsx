import React, { useEffect, useState } from "react";
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
  } = useGameStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const cleanupViewportListeners = initViewportListeners();
    return () => {
      cleanupViewportListeners();
    };
  }, [initViewportListeners]);

  useEffect(() => {
    const { width, height } = getBoardSize();
    console.log("Initializing game with size:", width, "x", height);
    initializeGame(width, height, viewport.width, viewport.height);
    setIsInitialized(true);
  }, [getBoardSize, initializeGame, viewport.width, viewport.height]);

  console.log("GameMap render:", {
    boardSize,
    viewport,
    board: {
      isMap: board instanceof Map,
      size: board instanceof Map ? board.size : "N/A",
      firstFewEntries:
        board instanceof Map ? Array.from(board.entries()).slice(0, 5) : "N/A",
    },
    isInitialized,
  });

  const handleHexClick = (hexKey) => {
    console.log("Hex clicked:", hexKey);
    handleHexSelection(hexKey);
  };

  if (!isInitialized) {
    return <div>Initializing game...</div>;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <span>Current Player: {getPlayerColor(currentPlayer)}</span>
        <span>
          Red: {getScores().player1} | Blue: {getScores().player2}
        </span>
        <span>
          Board: {boardSize.width}x{boardSize.height}
        </span>
      </div>
      <div>
        {gameStatus === "finished"
          ? getGameResultMessage()
          : "Game in progress"}
      </div>
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

export default GameMap;
