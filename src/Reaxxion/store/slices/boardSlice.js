import { Hex, Layout, Point } from "../../HexData/HexMath";
import { MapStorage } from "../../HexData/MapStorage";

/**
 * Board slice for the Ataxx game state management.
 * Handles the game board data, move validation, and piece conversion.
 */

/**
 * Calculates the appropriate hexagon size based on board dimensions and viewport
 * @param {number} boardWidth - Width of the board in hexes
 * @param {number} boardHeight - Height of the board in hexes
 * @param {number} viewportWidth - Width of the viewport
 * @param {number} viewportHeight - Height of the viewport
 * @returns {number} - Size of each hexagon
 */
const calculateHexSize = (
  boardWidth,
  boardHeight,
  viewportWidth,
  viewportHeight
) => {
  // For flat-topped hexagons:
  // Width of n hexes = size * (3/2 * n + 1/2)
  // Height of n hexes = size * sqrt(3) * n

  const maxWidthSize = viewportWidth / (1.5 * boardWidth + 0.5);
  const maxHeightSize = viewportHeight / (Math.sqrt(3) * boardHeight);

  // Choose the smaller of the two to ensure the board fits in both dimensions
  return Math.floor(Math.min(maxWidthSize, maxHeightSize));
};

/**
 * Creates the board slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The board slice methods and properties
 */

export const createBoardSlice = (set, get) => ({
  mapLayout: null,
  mapStorage: new MapStorage(),
  board: new Map(),
  boardSize: { width: 0, height: 0 },
  highlightedHexes: new Set(),

  /**
   * Creates the game board for a new game
   * @param {number} width - the amount of desired columns
   * @param {number} height - the amount of desired rows
   * @param {number} hexSize - the size of each hexagon
   */
  initializeBoard: (width, height, viewportWidth, viewportHeight) => {
    console.log("Initializing board with:", {
      width,
      height,
      viewportWidth,
      viewportHeight,
    });
    const hexSize = calculateHexSize(
      width,
      height,
      viewportWidth,
      viewportHeight
    );
    const newLayout = new Layout(
      Layout.flat,
      new Point(hexSize, hexSize),
      new Point(hexSize, hexSize)
    );
    const newMapStorage = new MapStorage();
    const newBoard = new Map();

    newMapStorage.createMap({ width, height });

    for (let q = 0; q < height; q++) {
      for (let r = 0; r < width; r++) {
        const key = `${q},${r}`;
        newBoard.set(key, null);
      }
    }

    // Set initial pieces
    newBoard.set("0,0", 1);
    newBoard.set(`${height - 1},${width - 1}`, 2);

    console.log("Board initialized:", {
      mapLayoutSize: newLayout.size,
      storageSize: newMapStorage.hexHash.size,
      boardSize: newBoard.size,
      boardEntries: Array.from(newBoard.entries()).slice(0, 5),
      width,
      height,
    });

    set({
      mapLayout: newLayout,
      mapStorage: newMapStorage,
      board: newBoard,
      boardSize: { width, height },
    });
  },

  /**
   * Moves a piece on the board
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
      newBoard.set(toKey, player);

      if (calculateDistance(fromKey, toKey) > 1) {
        newBoard.set(fromKey, null);
      }

      set({ board: newBoard });
      return true;
    }
    return false;
  },

  /**
   * Gets valid moves for a given position
   * @param {string} hexKey - Position to check
   * @returns {string[]} Array of valid move positions
   */
  getValidMoves: (hexKey) => {
    const { board, boardSize } = get();
    const [q, r] = hexKey.split(",").map(Number);
    const validMoves = [];

    for (let dq = -2; dq <= 2; dq++) {
      for (let dr = -2; dr <= 2; dr++) {
        if (dq === 0 && dr === 0) continue;
        const newQ = q + dq;
        const newR = r + dr;
        if (
          isValidHex({ q: newQ, r: newR }, boardSize) &&
          !board.get(`${newQ},${newR}`)
        ) {
          validMoves.push(`${newQ},${newR}`);
        }
      }
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
    const neighbors = getNeighbors(hexKey, boardSize);

    for (const neighborKey of neighbors) {
      if (
        board.get(neighborKey) !== null &&
        board.get(neighborKey) !== player
      ) {
        newBoard.set(neighborKey, player);
      }
    }

    set({ board: newBoard });
  },

  /** @param {string} hexKey - Hex to check */
  isHexHighlighted: (hexKey) => get().highlightedHexes.has(hexKey),

  /**
   * Highlights valid moves for a given position
   * @param {string} hexKey - Position to highlight moves for
   */
  highlightValidMoves: (hexKey) => {
    const { getValidMoves } = get();
    const validMoves = getValidMoves(hexKey);
    set({ highlightedHexes: new Set(validMoves) });
  },

  /** Clears all highlighted hexes */
  clearHighlights: () => set({ highlightedHexes: new Set() }),

  /**
   * Checks if the board needs to be reinitialized due to size change
   * @param {{width: number, height: number}} newSize - The new board size
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
   * @returns {{player1: number, player2: number}} - Scores for each player
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
 * Checks if a hex is within the board boundaries
 * @param {{q: number, r: number}} hexKey - The coordinates of the hex
 * @param {{width: number, height: number}} boardSize - The size of the board
 * @returns {boolean} Whether the hex is valid
 */
function isValidHex(hexKey, boardSize) {
  return (
    hexKey.q >= 0 &&
    hexKey.q < boardSize.height &&
    hexKey.r >= 0 &&
    hexKey.r < boardSize.width
  );
}

/**
 * Calculates distance between two hexes
 * @param {string} fromKey - The starting hex key
 * @param {string} toKey - The ending hex key
 * @returns {number} - The distance in hexes
 */
const calculateDistance = (fromKey, toKey) => {
  const [fromQ, fromR] = fromKey.split(",").map(Number);
  const [toQ, toR] = toKey.split(",").map(Number);
  const fromHex = new Hex(fromQ, fromR, -fromQ - fromR);
  const toHex = new Hex(toQ, toR, -toQ - toR);
  return fromHex.distance(toHex);
};

/**
 * Returns the valid hexes that neighbor the given hex
 * @param {string} hexKey - The key of the center hex
 * @param {{width: number, height: number}} boardSize - The size of the board
 * @returns {string[]} - Array of neighboring hex keys
 */
const getNeighbors = (hexKey, boardSize) => {
  const [q, r] = hexKey.split(",").map(Number);
  const directions = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];

  return directions
    .map(([dq, dr]) => ({ q: q + dq, r: r + dr }))
    .filter((neighbor) => isValidHex(neighbor, boardSize))
    .map(({ q, r }) => `${q},${r}`);
};

// Usage example:
/*
const useStore = create((set, get) => ({
  ...createBoardSlice(set, get),
  // ... other slices
}));

const { initializeBoard, movePiece, convertAdjacentPieces, highlightValidMoves } = useStore();

initializeBoard(7, 7, 800, 600);
highlightValidMoves("0,0");
if (movePiece("0,0", "1,1", 1)) {
  convertAdjacentPieces("1,1", 1);
}
*/
