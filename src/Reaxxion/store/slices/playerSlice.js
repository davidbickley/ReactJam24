// src/store/slices/playerSlice.js

/**
 * Player slice for the Ataxx game state management.
 * Handles player turns, colors, and selection state.
 */

/**
 * @typedef {Object} PlayerState
 * @property {number} currentPlayer - The current player (1 or 2)
 * @property {string|null} selectedHex - The currently selected hex, if any
 */

/**
 * Creates the player slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The player slice methods and properties
 */
export const createPlayerSlice = (set, get) => ({
  /** @type {PlayerState} */
  currentPlayer: 1,
  selectedHex: null,

  /**
   * Sets the current player
   * @param {number} player - The player to set as current (1 or 2)
   */
  setCurrentPlayer: (player) => set({ currentPlayer: player }),

  /**
   * Switches the current player
   */
  switchPlayer: () =>
    set((state) => ({
      currentPlayer: state.currentPlayer === 1 ? 2 : 1,
    })),

  /**
   * Gets the color associated with a player
   * @param {number} player - The player number (1 or 2)
   * @returns {string} The color associated with the player
   */
  getPlayerColor: (player) => (player === 1 ? "red" : "blue"),

  /**
   * Sets the selected hex
   * @param {string|null} hexKey - The key of the selected hex, or null to deselect
   */
  setSelectedHex: (hexKey) => set({ selectedHex: hexKey }),

  /**
   * Handles the hex selection process
   * @param {string} hexKey - The key of the clicked hex
   */
  handleHexSelection: (hexKey) => {
    const {
      currentPlayer,
      selectedHex,
      board,
      getValidMoves,
      movePiece,
      convertAdjacentPieces,
      switchPlayer,
    } = get();
    const clickedHexPlayer = board.get(hexKey);

    if (!selectedHex) {
      // First click - select piece
      if (clickedHexPlayer === currentPlayer) {
        set({ selectedHex: hexKey });
      }
    } else {
      // Second click - attempt move
      const validMoves = getValidMoves(selectedHex);
      if (validMoves.includes(hexKey)) {
        if (movePiece(selectedHex, hexKey, currentPlayer)) {
          convertAdjacentPieces(hexKey, currentPlayer);
          switchPlayer();
        }
      }
      set({ selectedHex: null });
    }
  },

  hasValidMoves: (player) => {
    const { board } = get();
    return Array.from(board.entries()).some(([key, piecePlayer]) => {
      if (piecePlayer === player) {
        const validMoves = get().getValidMoves(key);
        return validMoves.length > 0;
      }
      return false;
    });
  },

  /**
   * Gets the valid moves for the current player
   * @returns {Object.<string, string[]>} An object mapping piece positions to their valid moves
   */
  getCurrentPlayerValidMoves: () => {
    const { board, currentPlayer, getValidMoves } = get();
    const validMoves = {};

    for (const [hexKey, player] of board.entries()) {
      if (player === currentPlayer) {
        const moves = getValidMoves(hexKey);
        if (moves.length > 0) {
          validMoves[hexKey] = moves;
        }
      }
    }

    return validMoves;
  },
});

/**
 * Usage example:
 *
 * const useStore = create((set, get) => ({
 *   ...createBoardSlice(set, get),
 *   ...createPlayerSlice(set, get),
 *   // ... other slices
 * }));
 *
 * const { currentPlayer, handleHexSelection, getPlayerColor } = useStore();
 *
 * console.log(`Current player: ${getPlayerColor(currentPlayer)}`);
 * handleHexSelection("0-0");
 * handleHexSelection("1-1");
 */
