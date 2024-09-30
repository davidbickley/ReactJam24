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
      getOptimalBoardSize,
      initializeBoard,
      setCurrentPlayer,
      resetGameStatus,
    } = get();
    const { width, height } = getOptimalBoardSize();
    initializeBoard(width, height);
    setCurrentPlayer(1);
    resetGameStatus();
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
