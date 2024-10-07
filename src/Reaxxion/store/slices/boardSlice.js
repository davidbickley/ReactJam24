// src/store/slices/boardSlice.js

import { Hex, Layout, Point } from "../../HexData/HexMath";

/**
 * Calculates the distance between two hexes
 * @param {string} fromKey - The key of the starting hex (format: "q,r")
 * @param {string} toKey - The key of the ending hex (format: "q,r")
 * @returns {number} The distance between the two hexes
 */
export const calculateDistance = (fromKey, toKey) => {
  const [fromQ, fromR] = fromKey.split(",").map(Number);
  const [toQ, toR] = toKey.split(",").map(Number);
  const fromHex = new Hex(fromQ, fromR, -fromQ - fromR);
  const toHex = new Hex(toQ, toR, -toQ - toR);
  return fromHex.distance(toHex);
};

/**
 * Creates the board slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The board slice methods and properties
 */
export const createBoardSlice = (set, get) => ({
  // Board state
  mapLayout: new Layout(Layout.flat, new Point(50, 50), new Point(0, 0)),
  mapStorage: new Map(),
  board: new Map(),
  boardSize: { width: 0, height: 0 },
  highlightedHexes: new Set(),

  /**
   * Initializes the game board
   * @param {number} width - Number of columns
   * @param {number} height - Number of rows
   * @param {number} [hexSize=30] - Size of each hexagon
   */
  initializeBoard: (width, height, hexSize = 30) => {
    const newLayout = new Layout(
      Layout.flat,
      new Point(hexSize, hexSize),
      new Point((width * hexSize) / 2, (height * hexSize) / 2)
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

  /**
   * Resizes the board
   * @param {Point} size - New size for the hexagons
   */
  resizeBoard: (size) => {
    const { mapLayout } = get();
    const newLayout = new Layout(mapLayout.orientation, size, mapLayout.origin);
    set({ mapLayout: newLayout });
  },

  /**
   * Moves a piece on the board according to Ataxx rules
   * @param {string} fromKey - Starting position
   * @param {string} toKey - Ending position
   * @param {number} player - Current player
   * @returns {boolean} Whether the move was successful
   */
  movePiece: (fromKey, toKey, player) => {
    const { board, getValidMoves } = get();
    const validMoves = getValidMoves(fromKey);

    if (validMoves.includes(toKey)) {
      const newBoard = new Map(board);
      
      const distance = calculateDistance(fromKey, toKey);
      if (distance === 2) {
        // For jump moves, remove the piece from the original position
        // For adjacent moves (distance === 1), keep the original piece
        newBoard.set(fromKey, 0);
      }

      newBoard.set(toKey, player);
      
      set({ board: newBoard });
      return true;
    }
    return false;
  },

  /**
   * Gets valid moves for a given position according to Ataxx rules
   * @param {string} hexKey - The position to check
   * @returns {string[]} Array of valid move positions
   */
  getValidMoves: (hexKey) => {
    const { board, mapStorage, boardSize } = get();
    const [q, r] = hexKey.split(",").map(Number);
    const originHex = new Hex(q, r, -q - r);

    return [...mapStorage.keys()].filter((key) => {
      if (key === hexKey) return false; // Can't move to the same position
      const [targetQ, targetR] = key.split(",").map(Number);
      const targetHex = new Hex(targetQ, targetR, -targetQ - targetR);
      const distance = originHex.distance(targetHex);
      return (
        isValidHex(key, boardSize) && board.get(key) === 0 && distance <= 2
      );
    });
  },

  /**
   * Converts adjacent opponent pieces to the current player's color
   * @param {string} hexKey - The position of the newly placed piece
   * @param {number} player - The current player
   */
  convertAdjacentPieces: (hexKey, player) => {
    const { board, boardSize } = get();
    const newBoard = new Map(board);
    const opponentPlayer = player === 1 ? 2 : 1;

    for (const neighborKey of getNeighbors(hexKey, boardSize)) {
      if (board.get(neighborKey) === opponentPlayer) {
        newBoard.set(neighborKey, player);
      }
    }

    set({ board: newBoard });
  },

  /**
   * Checks if a hex is highlighted
   * @param {string} hexKey - The position to check
   * @returns {boolean} Whether the hex is highlighted
   */
  isHexHighlighted: (hexKey) => {
    const { highlightedHexes } = get();
    return highlightedHexes.has(hexKey);
  },

  /**
   * Highlights valid moves for a given position
   * @param {string} hexKey - The position to highlight moves for
   */
  highlightValidMoves: (hexKey) => {
    const validMoves = get().getValidMoves(hexKey);
    set({ highlightedHexes: new Set(validMoves) });
    console.log(`Highlighted hexes: ${[...validMoves].join(", ")}`);
  },

  /**
   * Clears all highlighted hexes
   */
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

/**
 * Checks if a move is valid
 * @param {string} fromKey - Starting position
 * @param {string} toKey - Ending position
 * @param {Map} board - Current game board
 * @param {Object} boardSize - Board dimensions
 * @returns {boolean} Whether the move is valid
 */
const isValidMove = (fromKey, toKey, board, boardSize) => {
  return (
    isValidHex(toKey, boardSize) &&
    !board.has(toKey) &&
    calculateDistance(fromKey, toKey) <= 2
  );
};

/**
 * Checks if a hex is within the board boundaries
 * @param {string} hexKey - The position to check
 * @param {Object} boardSize - Board dimensions
 * @returns {boolean} Whether the hex is valid
 */
const isValidHex = (hexKey, boardSize) => {
  const [q, r] = hexKey.split(",").map(Number);
  return 0 <= q && q < boardSize.height && 0 <= r && r < boardSize.width;
};

/**
 * Gets the neighboring hexes for a given position
 * @param {string} hexKey - The position to get neighbors for
 * @param {Object} boardSize - Board dimensions
 * @returns {string[]} Array of neighboring positions
 */
const getNeighbors = (hexKey, boardSize) => {
  const [q, r] = hexKey.split(",").map(Number);
  const testHex = new Hex(q, r, -q - r);
  return Hex.directions
    .map((dir) => testHex.add(dir))
    .filter((neighbor) => isValidHex(`${neighbor.q},${neighbor.r}`, boardSize))
    .map((neighbor) => `${neighbor.q},${neighbor.r}`);
};

/**
 * Usage example:
 *
 * const useStore = create((set, get) => ({
 *   ...createBoardSlice(set, get),
 *   // ... other slices
 * }));
 *
 * const { initializeBoard, movePiece, getValidMoves } = useStore();
 *
 * initializeBoard(7, 7);
 * console.log(getValidMoves("0,0"));
 * movePiece("0,0", "1,1", 1);
 */
