import { Hex, Layout } from "./HexMath";

export class MapStorage {
    // Constructor
    constructor(orientation, size, origin) {
        this.hexLayout = new Layout(orientation, size, origin);
        this.hexHash = new Map();
    }
    setHex(q, r, s) {
        this.hexHash.set({q: q, r: r}, s);
    }
    getHex(q, r) {
        return this.hexHash[{q: q, r: r}];
    }
}