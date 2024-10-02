// Reaxxion/HexData/MapStorage.jsx

import { Layout } from "./HexMath";

export class MapStorage {
  // Constructor
  constructor(orientation, size, origin) {
    this.hexLayout = new Layout(orientation, size, origin);
    this.hexHash = new Map();
  }
  setHex(q, r, s) {
    this.hexHash.set({ q: q, r: r }, s);
  }
  getHex(q, r) {
    return this.hexHash[{ q: q, r: r }];
  }
  createMap(boardSize) {
    for (let q = 0; q < boardSize.height; q++) {
      for (let r = 0; r < boardSize.width; r++) {
        this.setHex(q, r, -q - r);
      }
    }
  }
}
