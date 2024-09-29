// src/store/slices/boardSlice.js

/**
 * Board slice for the Ataxx game state management.
 * Handles the game board representation, move validation, and piece conversion.
 */

/**
 * @typedef {Object} BoardSize
 * @property {number} width - The width of the board
 * @property {number} height - The height of the board
 */

/**
 * @typedef {Object} BoardState
 * @property {Map<string, number>} board - The game board represented as a Map
 * @property {BoardSize} boardSize - The size of the game board
 */

/**
 * Creates the board slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The board slice methods and properties
 */
export const createBoardSlice = (set, get) => ({
  /** @type {BoardState} */
  board: new Map(),
  boardSize: { width: 7, height: 7 },

  /**
   * Initializes the game board
   * @param {number} width - The width of the board
   * @param {number} height - The height of the board
   */
  initializeBoard: (width, height) => {
    const newBoard = new Map();
    newBoard.set("0-0", 1);
    newBoard.set(`${width - 1}-${height - 1}`, 1);
    newBoard.set(`0-${height - 1}`, 2);
    newBoard.set(`${width - 1}-0`, 2);
    set({ board: newBoard, boardSize: { width, height } });
  },

  /**
   * Moves a piece on the board
   * @param {string} fromKey - The starting position
   * @param {string} toKey - The ending position
   * @param {number} player - The current player (1 or 2)
   * @returns {boolean} Whether the move was successful
   */
  movePiece: (fromKey, toKey, player) => {
    const { board } = get();
    if (!isValidMove(fromKey, toKey, board)) return false;

    const newBoard = new Map(board);
    newBoard.set(toKey, player);

    if (isJumpMove(fromKey, toKey)) {
      newBoard.delete(fromKey);
    }

    set({ board: newBoard });
    return true;
  },

  /**
   * Converts adjacent pieces after a move
   * @param {string} hexKey - The position of the newly placed piece
   * @param {number} player - The current player (1 or 2)
   */
  convertAdjacentPieces: (hexKey, player) => {
    const { board } = get();
    const [row, col] = hexKey.split("-").map(Number);
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    const newBoard = new Map(board);
    directions.forEach(([dRow, dCol]) => {
      const adjKey = `${row + dRow}-${col + dCol}`;
      if (board.has(adjKey) && board.get(adjKey) !== player) {
        newBoard.set(adjKey, player);
      }
    });

    set({ board: newBoard });
  },

  /**
   * Gets all valid moves for a given position
   * @param {string} hexKey - The position to check for valid moves
   * @returns {string[]} An array of valid move positions
   */
  getValidMoves: (hexKey) => {
    const { board, boardSize } = get();
    const [row, col] = hexKey.split("-").map(Number);
    const validMoves = [];

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === 0 && c === 0) continue;
        const newRow = row + r;
        const newCol = col + c;
        if (
          newRow >= 0 &&
          newRow < boardSize.height &&
          newCol >= 0 &&
          newCol < boardSize.width
        ) {
          const newKey = `${newRow}-${newCol}`;
          if (!board.has(newKey)) {
            validMoves.push(newKey);
          }
        }
      }
    }

    return validMoves;
  },

  /**
   * Checks if a player has any valid moves left
   * @param {number} player - The player to check for valid moves
   * @returns {boolean} Whether the player has any valid moves
   */
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
});

/**
 * Checks if a move is valid
 * @param {string} fromKey - The starting position
 * @param {string} toKey - The ending position
 * @param {Map<string, number>} board - The current game board
 * @returns {boolean} Whether the move is valid
 */
function isValidMove(fromKey, toKey, board) {
  if (board.has(toKey)) return false;

  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 2 && colDiff <= 2 && !(rowDiff === 0 && colDiff === 0);
}

/**
 * Checks if a move is a jump move
 * @param {string} fromKey - The starting position
 * @param {string} toKey - The ending position
 * @returns {boolean} Whether the move is a jump move
 */
function isJumpMove(fromKey, toKey) {
  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff > 1 || colDiff > 1;
}

/**
 * Usage example:
 *
 * const useStore = create((set, get) => ({
 *   ...createBoardSlice(set, get),
 *   // ... other slices
 * }));
 *
 * const { initializeBoard, movePiece, convertAdjacentPieces } = useStore();
 *
 * initializeBoard(7, 7);
 * if (movePiece("0-0", "1-1", 1)) {
 *   convertAdjacentPieces("1-1", 1);
 * }
 */
