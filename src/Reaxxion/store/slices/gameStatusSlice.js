// src/store/slices/gameStatusSlice.js

export const createGameStatusSlice = (set, get) => ({
  gameStatus: "playing",
  winner: null,

  setGameStatus: (status) => set({ gameStatus: status }),

  /**
   * Checks if the game is over and updates the game status accordingly
   */
  /**
   * Checks if the game is over and updates the game status accordingly
   */
  checkGameOver: () => {
    const { board, hasValidMoves, currentPlayer, boardSize } = get();
    const pieces = Array.from(board.values());
    const player1Pieces = pieces.filter((p) => p === 1).length;
    const player2Pieces = pieces.filter((p) => p === 2).length;

    let gameOver = false;

    // Check if the board is full
    if (player1Pieces + player2Pieces === boardSize.width * boardSize.height) {
      gameOver = true;
    }
    // Check if one player has no pieces left
    else if (player1Pieces === 0 || player2Pieces === 0) {
      gameOver = true;
    }
    // Check if neither player can make a move
    else if (!hasValidMoves(1) && !hasValidMoves(2)) {
      gameOver = true;
    }

    if (gameOver) {
      let winner = null;
      if (player1Pieces > player2Pieces) {
        winner = 1;
      } else if (player2Pieces > player1Pieces) {
        winner = 2;
      }
      // If pieces are equal, winner remains null (tie)

      set({ gameStatus: "finished", winner });
    }
  },

  /**
   * Gets the current scores for both players
   * @returns {{player1: number, player2: number}} The scores for each player
   */
  getScores: () => {
    const { board } = get();
    const pieces = Array.from(board.values());
    return {
      player1: pieces.filter((p) => p === 1).length,
      player2: pieces.filter((p) => p === 2).length,
    };
  },

  resetGameStatus: () => set({ gameStatus: "playing", winner: null }),

  getGameResultMessage: () => {
    const { gameStatus, winner, getPlayerColor } = get();
    if (gameStatus !== "finished") {
      return "Game in progress";
    }
    if (winner === null) {
      return "The game ended in a tie!";
    }
    return `${getPlayerColor(winner)} player wins!`;
  },
});
