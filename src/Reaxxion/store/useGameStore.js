// src/store/useGameStore.js

import { create } from "zustand";
import { createBoardSlice } from "./slices/boardSlice";
import { createPlayerSlice } from "./slices/playerSlice";
import { createGameStatusSlice } from "./slices/gameStatusSlice";

const useGameStore = create((set, get) => ({
  ...createBoardSlice(set, get),
  ...createPlayerSlice(set, get),
  ...createGameStatusSlice(set, get),

  initializeGame: (width, height) => {
    get().initializeBoard(width, height);
    get().setCurrentPlayer(1);
    get().resetGameStatus();
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
