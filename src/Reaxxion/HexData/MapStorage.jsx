export class MapStorage {
  constructor() {
    this.hexHash = new Map();
  }

  setHex(q, r, s) {
    this.hexHash.set(`${q},${r}`, s);
  }

  getHex(q, r) {
    return this.hexHash.get(`${q},${r}`);
  }

  createMap(boardSize) {
    for (let q = 0; q < boardSize.height; q++) {
      for (let r = 0; r < boardSize.width; r++) {
        this.setHex(q, r, -q - r);
      }
    }
  }
}
