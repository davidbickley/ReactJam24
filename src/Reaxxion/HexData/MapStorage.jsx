import { Hex, Layout } from "./HexMath";

export class MapStorage {
    // Constructor
    constructor(orientation, size, origin) {
        this.hexArray = [];
        this.hexLayout = new Layout(orientation, size, origin);
        this.hexHash = new Map();
    }
    addHex(hex) {
        const i = this.hexArray.push(hex);
        this.hexHash.set({ q: hex.q, r: hex.r}, i);
    }
    setHex(i, hex) {
        this.hexArray[i] = hex;
        this.hexHash.set({q: hex.q, r: hex.r}, i);
    }
    getHex(q, r) {
        return this.hexHash[{q: q, r: r}];
    }
}