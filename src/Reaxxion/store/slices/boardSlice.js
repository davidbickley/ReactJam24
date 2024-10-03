// src/store/slices/boardSlice.js

import { Layout, Point } from "../../HexData/HexMath";

/**
 * Board slice for the Ataxx game state management.
 * Handles the game board data, move validation, and piece conversion.
 */

/**
 * Creates the board slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The board slice methods and properties
 */
export const createBoardSlice = (set, get) => ({
  mapLayout: new Layout(Layout.flat, 50, new Point(0, 0)),
  mapStorage: new Map(),
  board: new Map(),
  boardSize: {
    width: 0,
    height: 0
  },
  highlightedHexes: new Set(),

  initializeBoard: (width, height, hexSize) => {
    // Initialize a layout to be given to the mapLayout state value
    // TODO: Some of its parameters are hard coded right now but we can/should change that
    const newLayout = new Layout(Layout.flat, hexSize, new Point(0, 0));

    // Initialize a map to be given to the mapStorage state value
    const newStorage = new Map();

    // Temporary hard-coded map formation algorithm
    for (let q = 0; q < height; q++) {
      for (let r = 0; r < width; r++) {
        newStorage.set(q, r, -q - r);
      }
    }

    // Initialize a map of coordinates to player ownership
    const newBoard = new Map();

    // Temporarily hard-coded board player setter
    for (let q = 0; q < height; q++) {
      for (let r = 0; r < width; r++) {
        newBoard.set({ q: q, r: r }, 0);
      }
    }
    // Player 1 gets the first space, player 2 gets the last space
    newBoard.set({ q: 0, r: 0 }, 1);
    newBoard.set({ q: height - 1, r: width - 1 }, 2);

    set({
      mapLayout: newLayout,
      mapStorage: newStorage,
      board: newBoard
    });
  },

  resizeBoard: (size) => {
    const { mapLayout } = get();
    const newLayout = mapLayout;
    newLayout.size = size;

    set({
      mapLayout: newLayout
    });
  },

  // movePiece: (fromKey, toKey, player) => {
  //   const { board, getValidMoves } = get();
  //   const validMoves = getValidMoves(fromKey);

  //   if (validMoves.includes(toKey)) {
  //     const newBoard = new Map(board);
  //     newBoard.set(toKey, player);

  //     // If it's a jump move, remove the piece from the original position
  //     if (calculateDistance(fromKey, toKey) > 1) {
  //       newBoard.delete(fromKey);
  //     }

  //     set({ board: newBoard });
  //     return true;
  //   }
  //   return false;
  // },

  // /**
  //  * Gets valid moves for a given hex
  //  * @param {string} hexKey - The key of the hex to get moves for
  //  * @returns {string[]} Array of valid move hex keys
  //  */
  // getValidMoves: (hexKey) => {
  //   const { board, boardSize } = get();
  //   const [row, col] = hexKey.split("-").map(Number);
  //   const validMoves = [];

  //   // Check all hexes within a two-tile radius
  //   for (let dr = -2; dr <= 2; dr++) {
  //     for (let dc = -2; dc <= 2; dc++) {
  //       // Skip the current hex
  //       if (dr === 0 && dc === 0) continue;

  //       // Calculate the actual hexagonal distance
  //       const distance = (Math.abs(dr) + Math.abs(dc) + Math.abs(dr + dc)) / 2;

  //       // Only include hexes within 2 steps
  //       if (distance <= 2) {
  //         const newRow = row + dr;
  //         const newCol = col + dc;
  //         const newKey = `${newRow}-${newCol}`;

  //         if (isValidHex(newRow, newCol, boardSize) && !board.has(newKey)) {
  //           validMoves.push(newKey);
  //         }
  //       }
  //     }
  //   }

  //   return validMoves;
  // },

  // /**
  //  * Converts adjacent pieces to the current player's color
  //  * @param {string} hexKey - The key of the hex that was just placed
  //  * @param {number} player - The current player (1 or 2)
  //  */
  // convertAdjacentPieces: (hexKey, player) => {
  //   const { board } = get();
  //   const [row, col] = hexKey.split("-").map(Number);
  //   const newBoard = new Map(board);

  //   for (let r = -1; r <= 1; r++) {
  //     for (let c = -1; c <= 1; c++) {
  //       if (r === 0 && c === 0) continue;
  //       const newRow = row + r;
  //       const newCol = col + c;
  //       const adjacentKey = `${newRow}-${newCol}`;
  //       if (board.has(adjacentKey) && board.get(adjacentKey) !== player) {
  //         newBoard.set(adjacentKey, player);
  //       }
  //     }
  //   }

  //   set({ board: newBoard });
  // },

  // isHexHighlighted: (hexKey) => {
  //   const { highlightedHexes } = get();
  //   return highlightedHexes.has(hexKey);
  // },

  // highlightValidMoves: (hexKey) => {
  //   const { getValidMoves } = get();
  //   const validMoves = getValidMoves(hexKey);
  //   set({ highlightedHexes: new Set(validMoves) });
  // },

  // clearHighlights: () => {
  //   set({ highlightedHexes: new Set() });
  // },

  // movePiece: (fromKey, toKey, player) => {
  //   const { board, getValidMoves } = get();
  //   const validMoves = getValidMoves(fromKey);

  //   if (validMoves.includes(toKey)) {
  //     const newBoard = new Map(board);
  //     newBoard.set(toKey, player);

  //     // If it's a jump move (distance > 1), remove the piece from the original position
  //     if (calculateDistance(fromKey, toKey) > 1) {
  //       newBoard.delete(fromKey);
  //     }

  //     set({ board: newBoard });
  //     return true;
  //   }
  //   return false;
  // },

  // convertAdjacentPieces: (hexKey, player) => {
  //   const { board, boardSize } = get();
  //   const [row, col] = hexKey.split("-").map(Number);
  //   const newBoard = new Map(board);

  //   for (let r = -1; r <= 1; r++) {
  //     for (let c = -1; c <= 1; c++) {
  //       if (r === 0 && c === 0) continue;
  //       const newRow = row + r;
  //       const newCol = col + c;
  //       if (
  //         newRow >= 0 &&
  //         newRow < boardSize.height &&
  //         newCol >= 0 &&
  //         newCol < boardSize.width
  //       ) {
  //         const adjacentKey = `${newRow}-${newCol}`;
  //         if (board.has(adjacentKey) && board.get(adjacentKey) !== player) {
  //           newBoard.set(adjacentKey, player);
  //         }
  //       }
  //     }
  //   }

  //   set({ board: newBoard });
  // },

  // /**
  //  * Gets valid moves for a given hex
  //  * @param {string} hexKey - The key of the hex to get moves for
  //  * @returns {string[]} Array of valid move hex keys
  //  */
  // getValidMoves: (hexKey) => {
  //   const { board, boardSize } = get();
  //   const [row, col] = hexKey.split("-").map(Number);
  //   const validMoves = [];

  //   // Check all hexes within a two-tile radius
  //   for (let r = -2; r <= 2; r++) {
  //     for (let c = -2; c <= 2; c++) {
  //       if (r === 0 && c === 0) continue; // Skip the current hex
  //       const newRow = row + r;
  //       const newCol = col + c;
  //       const newKey = `${newRow}-${newCol}`;

  //       if (isValidHex(newRow, newCol, boardSize) && !board.has(newKey)) {
  //         validMoves.push(newKey);
  //       }
  //     }
  //   }

  //   return validMoves;
  // },

  //   hasValidMoves: (player) => {
  //     const { board } = get();
  //     return Array.from(board.entries()).some(([key, piecePlayer]) => {
  //       if (piecePlayer === player) {
  //         const validMoves = get().getValidMoves(key);
  //         return validMoves.length > 0;
  //       }
  //       return false;
  //     });
  //   },

  //   /**
  //    * Highlights hexagons within two spaces of the selected hexagon
  //    * @param {string|null} hexKey - The key of the selected hexagon, or null to clear highlights
  //    */
  //   highlightValidMoves: (hexKey) => {
  //     if (!hexKey) {
  //       set({ highlightedHexes: new Set() });
  //       return;
  //     }

  //     const validMoves = get().getValidMoves(hexKey);
  //     set({ highlightedHexes: new Set(validMoves) });
  //   },

  //   /**
  //    * Checks if a hexagon is highlighted
  //    * @param {string} hexKey - The key of the hexagon to check
  //    * @returns {boolean} Whether the hexagon is highlighted
  //    */
  //   isHexHighlighted: (hexKey) => {
  //     const { highlightedHexes } = get();
  //     return highlightedHexes.has(hexKey);
  //   },

  //   /**
  //    * Checks if the board needs to be reinitialized due to size change
  //    * @param {Object} newSize - The new board size
  //    * @returns {boolean} Whether the board needs reinitialization
  //    */
  //   needsBoardReset: (newSize) => {
  //     const { boardSize } = get();
  //     return (
  //       newSize.width !== boardSize.width || newSize.height !== boardSize.height
  //     );
  //   },

  //   getScores: () => {
  //     const { board } = get();
  //     const scores = { player1: 0, player2: 0 };

  //     for (const player of board.values()) {
  //       if (player === 1) scores.player1++;
  //       else if (player === 2) scores.player2++;
  //     }

  //     return scores;
  //   },

});

// function isValidMove(fromKey, toKey, board) {
//   if (board.has(toKey)) return false;

//   const [fromRow, fromCol] = fromKey.split("-").map(Number);
//   const [toRow, toCol] = toKey.split("-").map(Number);

//   const rowDiff = Math.abs(toRow - fromRow);
//   const colDiff = Math.abs(toCol - fromCol);

//   return rowDiff <= 2 && colDiff <= 2 && !(rowDiff === 0 && colDiff === 0);
// }

// function isJumpMove(fromKey, toKey) {
//   const [fromRow, fromCol] = fromKey.split("-").map(Number);
//   const [toRow, toCol] = toKey.split("-").map(Number);

//   const rowDiff = Math.abs(toRow - fromRow);
//   const colDiff = Math.abs(toCol - fromCol);

//   return rowDiff > 1 || colDiff > 1;
// }

// /**
//  * Checks if a hex is within the board boundaries
//  * @param {number} row - The row of the hex
//  * @param {number} col - The column of the hex
//  * @param {Object} boardSize - The size of the board
//  * @returns {boolean} Whether the hex is valid
//  */
// function isValidHex(row, col, boardSize) {
//   return (
//     row >= 0 && row < boardSize.height && col >= 0 && col < boardSize.width
//   );
// }

// // Helper function to calculate distance between two hexes
// const calculateDistance = (fromKey, toKey) => {
//   const [fromRow, fromCol] = fromKey.split("-").map(Number);
//   const [toRow, toCol] = toKey.split("-").map(Number);
//   return Math.max(Math.abs(fromRow - toRow), Math.abs(fromCol - toCol));
// };

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
