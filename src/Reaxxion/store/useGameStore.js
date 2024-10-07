// src/store/useGameStore.js

import { create } from "zustand";
import { createBoardSlice } from "./slices/boardSlice";
import { createPlayerSlice } from "./slices/playerSlice";
import { createGameStatusSlice } from "./slices/gameStatusSlice";
import { createViewportSlice } from "./slices/viewportSlice";

const useGameStore = create((set, get) => ({
  ...createBoardSlice(set, get),
  ...createPlayerSlice(set, get),
  ...createGameStatusSlice(set, get),
  ...createViewportSlice(set, get),

  initializeGame: () => {
    const {
      getBoardSize,
      initializeBoard,
      setCurrentPlayer,
      resetGameStatus,
      clearHighlights,
    } = get();
    const { width, height } = getBoardSize();
    initializeBoard(width, height);
    setCurrentPlayer(1);
    resetGameStatus();
    clearHighlights();
  },

  handleHexSelection: (hexKey) => {
    const {
      currentPlayer,
      selectedHex,
      board,
      movePiece,
      convertAdjacentPieces,
      switchPlayer,
      setSelectedHex,
      highlightValidMoves,
      clearHighlights,
      checkGameOver,
      gameStatus,
      getValidMoves,
    } = get();

    console.log(`Handling hex selection for ${hexKey}`);
    console.log(`Current game status: ${gameStatus}`);
    console.log(`Current player: ${currentPlayer}`);
    console.log(`Selected hex: ${selectedHex}`);

    if (gameStatus !== "playing") {
      console.log("Game is not in playing state, ignoring selection");
      return;
    }

    if (!selectedHex) {
      console.log(`Checking if ${hexKey} belongs to current player`);
      if (board.get(hexKey) === currentPlayer) {
        console.log(`Selecting ${hexKey} and highlighting valid moves`);
        setSelectedHex(hexKey);
        const validMoves = getValidMoves(hexKey);
        console.log(`Valid moves: ${validMoves.join(", ")}`);
        highlightValidMoves(hexKey);
      } else {
        console.log(`${hexKey} does not belong to current player`);
      }
    } else {
      console.log(`Attempting to move from ${selectedHex} to ${hexKey}`);
      if (hexKey !== selectedHex) {
        if (movePiece(selectedHex, hexKey, currentPlayer)) {
          console.log(`Move successful, converting adjacent pieces`);
          convertAdjacentPieces(hexKey, currentPlayer);
          switchPlayer();
          checkGameOver();
        } else {
          console.log(`Invalid move from ${selectedHex} to ${hexKey}`);
        }
      } else {
        console.log(`Same hex selected, deselecting`);
      }
      setSelectedHex(null);
      clearHighlights();
    }

    // Log the updated board state
    console.log("Current board state:");
    board.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  },

  makeMove: (fromKey, toKey) => {
    const {
      currentPlayer,
      movePiece,
      convertAdjacentPieces,
      switchPlayer,
      checkGameOver,
    } = get();

    if (movePiece(fromKey, toKey, currentPlayer)) {
      convertAdjacentPieces(toKey, currentPlayer);
      switchPlayer();
      checkGameOver();
    }
  },
}));

export default useGameStore;
