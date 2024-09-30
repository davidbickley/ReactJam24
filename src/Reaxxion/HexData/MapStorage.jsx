import { Hex } from "./HexMath";

export class MapStorage {
    // Constructor
    constructor() {
        hexArray = Array();
        hashmap = new Map();
    }
    addHex(hex) {
        i = hexArray.push(hex)
        hashmap.set({ q: hex.q, r: hex.r}, i);
    }
    setHex(i, hex) {
        hexArray[i] = hex;
        hashmap.set({q: hex.q, r: hex, r}, i);
    }
    getHex(q, r) {
        return hashmap[{q: q, r: r}];
    }
}