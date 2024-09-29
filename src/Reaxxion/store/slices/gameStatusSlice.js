// src/store/slices/gameStatusSlice.js

/**
 * Game status slice for the Ataxx game state management.
 * Handles game status, win conditions, and scoring.
 */

/**
 * @typedef {'playing'|'finished'} GameStatus
 */

/**
 * @typedef {Object} GameStatusState
 * @property {GameStatus} gameStatus - The current status of the game
 * @property {number|null} winner - The winner of the game (1, 2, or null for a tie)
 */

/**
 * Creates the game status slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The game status slice methods and properties
 */
export const createGameStatusSlice = (set, get) => ({
  /** @type {GameStatusState} */
  gameStatus: "playing",
  winner: null,

  /**
   * Sets the game status
   * @param {GameStatus} status - The new game status
   */
  setGameStatus: (status) => set({ gameStatus: status }),

  /**
   * Checks if the game is over and updates the game status accordingly
   */
  checkGameOver: () => {
    const { board, hasValidMoves, currentPlayer } = get();
    const pieces = Array.from(board.values());
    const player1Pieces = pieces.filter((p) => p === 1).length;
    const player2Pieces = pieces.filter((p) => p === 2).length;

    let gameOver = false;
    let winner = null;

    if (player1Pieces === 0) {
      gameOver = true;
      winner = 2;
    } else if (player2Pieces === 0) {
      gameOver = true;
      winner = 1;
    } else if (player1Pieces + player2Pieces === board.size) {
      gameOver = true;
      winner =
        player1Pieces > player2Pieces
          ? 1
          : player2Pieces > player1Pieces
          ? 2
          : null;
    } else if (!hasValidMoves(currentPlayer)) {
      const otherPlayer = currentPlayer === 1 ? 2 : 1;
      if (!hasValidMoves(otherPlayer)) {
        gameOver = true;
        winner =
          player1Pieces > player2Pieces
            ? 1
            : player2Pieces > player1Pieces
            ? 2
            : null;
      }
    }

    if (gameOver) {
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

  /**
   * Resets the game status to the initial state
   */
  resetGameStatus: () => {
    set({ gameStatus: "playing", winner: null });
  },

  /**
   * Gets the game result message
   * @returns {string} A message describing the game result
   */
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

/**
 * Usage example:
 *
 * const useStore = create((set, get) => ({
 *   ...createBoardSlice(set, get),
 *   ...createPlayerSlice(set, get),
 *   ...createGameStatusSlice(set, get),
 * }));
 *
 * const { checkGameOver, getScores, getGameResultMessage } = useStore();
 *
 * // After each move:
 * checkGameOver();
 *
 * const scores = getScores();
 * console.log(`Scores - Red: ${scores.player1}, Blue: ${scores.player2}`);
 *
 * // When the game is over:
 * console.log(getGameResultMessage());
 */
