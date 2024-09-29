// Reaxxion/components/Map/GameMap.jsx

/**
 * GameMap component for rendering the main game interface.
 * This component manages the game state and renders the HexGrid along with game information.
 */

import React, { useEffect, useState, useMemo, useCallback } from "react";
import HexGrid from "./HexGrid";
import useGameStore from "../../store/useGameStore";

/**
 * @param {Object} props - Component props
 * @param {string} [props.width="100%"] - Width of the game map container
 * @param {string} [props.height="100%"] - Height of the game map container
 */
const GameMap = ({ width = "100%", height = "100%" }) => {
  /** @type {{width: number, height: number}} */
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

  // Initialize the game board
  useEffect(() => {
    initializeGame(7, 7); // Initialize a 7x7 board
    // TODO: Make this dynamic based on viewport dimensions
  }, [initializeGame]);

  // Update dimensions on window resize
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

  /**
   * Handle hex click events
   * @param {string} hexKey - The key of the clicked hexagon
   */
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

/**
 * Usage example:
 *
 * <GameMap width="100%" height="80vh" />
 */
