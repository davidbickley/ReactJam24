// src/store/slices/boardSlice.js

import { getValue } from "@testing-library/user-event/dist/utils";
import { Hex, Layout, Point } from "../../HexData/HexMath";

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
    height: 0,
  },
  highlightedHexes: new Set(),

  /**
   * Creates the game board for a new game
   * @param {number} width - the amount of desired columns
   * @param {number} height - the amount of desired rows
   * @param {number} hexSize - the size of each hexagon
   */
  initializeBoard: (width, height, hexSize) => {
    // Initialize a layout to be given to the mapLayout state value
    // TODO: Some of its parameters are hard coded right now but we can/should change that
    const size = typeof hexSize === "number" ? hexSize : 30; // Default size of 30 if not provided
    const newLayout = new Layout(
      Layout.flat,
      new Point(size, size),
      new Point((width * size) / 2, (height * size) / 2) // Center the grid
    );

    // Initialize a map to be given to the mapStorage state value
    const newStorage = new Map();

    // Initialize a map of coordinates to player ownership
    const newBoard = new Map();

    // Temporary hard-coded map formation algorithm
    for (let q = 0; q < height; q++) {
      for (let r = 0; r < width; r++) {
        const key = `${q},${r}`;
        newStorage.set(key, new Hex(q, r, -q - r));
        // Initialize all hexes as unowned (0)
        newBoard.set(key, 0);
      }
    }

    // Temporarily hard-coded board player setter
    // Player 1 gets the first space, player 2 gets the last space
    newBoard.set("0,0", 1);
    newBoard.set(`${height - 1},${width - 1}`, 2);

    console.log("Initialized board:", newBoard);

    set({
      mapLayout: newLayout,
      mapStorage: newStorage,
      board: newBoard,
      boardSize: { width, height },
    });
  },

  resizeBoard: (size) => {
    const { mapLayout } = get();
    const newLayout = new Layout(mapLayout);
    newLayout.size = size;

    set({
      mapLayout: newLayout,
    });
  },

  movePiece: (fromKey, toKey, player) => {
    const { board, getValidMoves } = get();
    const validMoves = getValidMoves(fromKey);

    if (validMoves.includes(toKey)) {
      const newBoard = new Map(board);
      newBoard.set(`${toKey.q},${toKey.r}`, player);

      // If it's a jump move, remove the piece from the original position
      if (calculateDistance(fromKey, toKey) > 1) {
        newBoard.delete(`${fromKey.q},${fromKey.r}`);
      }

      console.log("Updated board after move:", newBoard);

      set({ board: newBoard });
      return true;
    }
    return false;
  },

  getValidMoves: (hexKey) => {
    const { board, mapStorage, boardSize } = get();

    // Get all the keys
    const allKeys = [...mapStorage.keys()];
    // Set up a function to filter allKeys to only hexes within a two-tile radius
    const keyValidator = allKeys.filter((key) => {
      console.log("Board.has(key) = " + board.has(key));
      if (isValidHex(key, boardSize)
        && !board.has(key)
        && calculateDistance(hexKey, key) <= 2) {
        return true;
      }
      else { return false };
    });

    const validMoves = [];
    for (const otherKey of keyValidator)
    {
      validMoves.push(otherKey);
    }
    
    return validMoves;
  },

  /**
   * Converts adjacent pieces to the current player's color
   * @param {string} hexKey - The key of the hex that was just placed
   * @param {number} player - The current player (1 or 2)
   */
  convertAdjacentPieces: (hexKey, player) => {
    const { board, boardSize } = get();
    const newBoard = new Map(board);

    for (let otherKey of getNeighbors(hexKey, boardSize)) {
      const keyString = `${otherKey.q},${otherKey.r}`;
      if (board.has(keyString)) {
        newBoard.set(keyString, player);
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

  /**
   * Checks if the board needs to be reinitialized due to size change
   * @param {Object} newSize - The new board size
   * @returns {boolean} - Whether the board needs reinitialization
   */
  needsBoardReset: (newSize) => {
    const { boardSize } = get();
    return (
      newSize.width !== boardSize.width || newSize.height !== boardSize.height
    );
  },

  /**
   * Calculates the score of the game
   * @returns {Object} - An object with { player1: score, player2: score }
   */
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

function isValidHex(hexKey, boardSize) {
  const [q, r] = hexKey.split(",").map(Number);
  return 0 <= q && q < boardSize.height && 0 <= r && r < boardSize.width;
}

const calculateDistance = (fromKey, toKey) => {
  const [fromQ, fromR] = fromKey.split(",").map(Number);
  const [toQ, toR] = toKey.split(",").map(Number);
  const fromHex = new Hex(fromQ, fromR, -fromQ - fromR);
  const toHex = new Hex(toQ, toR, -toQ - toR);
  console.log("Distance: " + fromHex.distance(toHex));
  return fromHex.distance(toHex);
};

const getNeighbors = (hexKey, boardSize) => {
  const [q, r] = hexKey.split(",").map(Number);
  const testHex = new Hex(q, r, -q - r);
  const neighbors = [];

  for (let i = 0; i < 6; i++) {
    const neighbor = testHex.neighbor(Hex.directions[i]);
    const neighborKey = `${neighbor.q},${neighbor.r}`;
    if (isValidHex(neighborKey, boardSize)) {
      neighbors.push(neighborKey);
    }
  }

  return neighbors;
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
