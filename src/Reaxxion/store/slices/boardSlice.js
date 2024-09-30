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
 * @property {Set<string>} highlightedHexes - Set of hexagon keys to highlight
 */

/**
 * Creates the board slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The board slice methods and properties
 */
export const createBoardSlice = (set, get) => ({
  board: new Map(),
  boardSize: { width: 7, height: 7 },
  highlightedHexes: new Set(),

  initializeBoard: (width, height) => {
    const newBoard = new Map();

    newBoard.set("0-0", 1);
    newBoard.set(`${height - 1}-${width - 1}`, 1);
    newBoard.set(`0-${width - 1}`, 2);
    newBoard.set(`${height - 1}-0`, 2);

    set({
      board: newBoard,
      boardSize: { width, height },
      highlightedHexes: new Set(),
    });
  },

  movePiece: (fromKey, toKey, player) => {
    const { board, getValidMoves } = get();
    const validMoves = getValidMoves(fromKey);

    if (validMoves.includes(toKey)) {
      const newBoard = new Map(board);
      newBoard.set(toKey, player);

      // If it's a jump move, remove the piece from the original position
      if (calculateDistance(fromKey, toKey) > 1) {
        newBoard.delete(fromKey);
      }

      set({ board: newBoard });
      return true;
    }
    return false;
  },

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

  convertAdjacentPieces: (hexKey, player) => {
    const { board, boardSize } = get();
    const [row, col] = hexKey.split("-").map(Number);
    const newBoard = new Map(board);

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        const newRow = row + r;
        const newCol = col + c;
        if (
          newRow >= 0 &&
          newRow < boardSize.height &&
          newCol >= 0 &&
          newCol < boardSize.width
        ) {
          const adjacentKey = `${newRow}-${newCol}`;
          if (board.has(adjacentKey) && board.get(adjacentKey) !== player) {
            newBoard.set(adjacentKey, player);
          }
        }
      }
    }

    set({ board: newBoard });
  },

  isHexHighlighted: (hexKey) => {
    const { highlightedHexes } = get();
    return highlightedHexes.has(hexKey);
  },

  highlightValidMoves: (hexKey) => {
    const { getValidMoves } = get();
    const validMoves = getValidMoves(hexKey);
    set({ highlightedHexes: new Set(validMoves) });
  },

  clearHighlights: () => {
    set({ highlightedHexes: new Set() });
  },

  movePiece: (fromKey, toKey, player) => {
    const { board } = get();
    if (!isValidMove(fromKey, toKey, board)) return false;

    const newBoard = new Map(board);
    newBoard.set(toKey, player);

    if (isJumpMove(fromKey, toKey)) {
      newBoard.delete(fromKey);
    }

    set({ board: newBoard, highlightedHexes: new Set() });
    return true;
  },

  convertAdjacentPieces: (hexKey, player) => {
    const { board, boardSize } = get();
    const [row, col] = hexKey.split("-").map(Number);
    const newBoard = new Map(board);

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        const newRow = row + r;
        const newCol = col + c;
        if (
          newRow >= 0 &&
          newRow < boardSize.height &&
          newCol >= 0 &&
          newCol < boardSize.width
        ) {
          const adjacentKey = `${newRow}-${newCol}`;
          if (board.has(adjacentKey) && board.get(adjacentKey) !== player) {
            newBoard.set(adjacentKey, player);
          }
        }
      }
    }

    set({ board: newBoard });
  },

  getValidMoves: (hexKey) => {
    const { board, boardSize } = get();
    const [row, col] = hexKey.split("-").map(Number);
    const validMoves = [];

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (r === 0 && c === 0) continue;
        if (Math.abs(r) + Math.abs(c) > 2) continue; // This line ensures we're strictly within 2 spaces
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
   * Highlights hexagons within two spaces of the selected hexagon
   * @param {string|null} hexKey - The key of the selected hexagon, or null to clear highlights
   */
  highlightValidMoves: (hexKey) => {
    if (!hexKey) {
      set({ highlightedHexes: new Set() });
      return;
    }

    const validMoves = get().getValidMoves(hexKey);
    set({ highlightedHexes: new Set(validMoves) });
  },

  /**
   * Checks if a hexagon is highlighted
   * @param {string} hexKey - The key of the hexagon to check
   * @returns {boolean} Whether the hexagon is highlighted
   */
  isHexHighlighted: (hexKey) => {
    const { highlightedHexes } = get();
    return highlightedHexes.has(hexKey);
  },

  /**
   * Checks if the board needs to be reinitialized due to size change
   * @param {Object} newSize - The new board size
   * @returns {boolean} Whether the board needs reinitialization
   */
  needsBoardReset: (newSize) => {
    const { boardSize } = get();
    return (
      newSize.width !== boardSize.width || newSize.height !== boardSize.height
    );
  },

  getScores: () => {
    const { board } = get();
    const scores = { player1: 0, player2: 0 };

    for (const player of board.values()) {
      if (player === 1) scores.player1++;
      else if (player === 2) scores.player2++;
    }

    return scores;
  },
});

function isValidMove(fromKey, toKey, board) {
  if (board.has(toKey)) return false;

  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 2 && colDiff <= 2 && !(rowDiff === 0 && colDiff === 0);
}

function isJumpMove(fromKey, toKey) {
  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);

  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff > 1 || colDiff > 1;
}

// Helper function to calculate distance between two hexes
const calculateDistance = (fromKey, toKey) => {
  const [fromRow, fromCol] = fromKey.split("-").map(Number);
  const [toRow, toCol] = toKey.split("-").map(Number);
  return Math.max(Math.abs(fromRow - toRow), Math.abs(fromCol - toCol));
};

/**
 * Usage example:
 *
 * const useStore = create((set, get) => ({
 *   ...createBoardSlice(set, get),
 *   // ... other slices
 * }));
 *
 * const { initializeBoard, movePiece, convertAdjacentPieces, highlightValidMoves } = useStore();
 *
 * initializeBoard(7, 7);
 * highlightValidMoves("0-0");
 * if (movePiece("0-0", "1-1", 1)) {
 *   convertAdjacentPieces("1-1", 1);
 * }
 */
