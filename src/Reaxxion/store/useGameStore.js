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

  initializeGame: (width, height, viewportWidth, viewportHeight) => {
    const {
      initializeBoard,
      setCurrentPlayer,
      resetGameStatus,
      clearHighlights,
    } = get();
    initializeBoard(width, height, viewportWidth, viewportHeight);
    setCurrentPlayer(1);
    resetGameStatus();
    clearHighlights();

    console.log("Game initialized:", {
      board: get().board,
      boardSize: get().boardSize,
      currentPlayer: get().currentPlayer,
    });
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
    } = get();

    if (gameStatus !== "playing") return;

    if (!selectedHex) {
      if (board.get(hexKey) === currentPlayer) {
        setSelectedHex(hexKey);
        highlightValidMoves(hexKey);
      }
    } else {
      if (hexKey !== selectedHex) {
        if (movePiece(selectedHex, hexKey, currentPlayer)) {
          convertAdjacentPieces(hexKey, currentPlayer);
          switchPlayer();
          checkGameOver();
        }
      }
      setSelectedHex(null);
      clearHighlights();
    }
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
