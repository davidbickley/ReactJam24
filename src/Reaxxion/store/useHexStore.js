// Reaxxion/store/useHexStore

import { create } from "zustand";

const useHexStore = create((set) => ({
  clickedHexes: new Set(),
  toggleHex: (key) =>
    set((state) => {
      const newClickedHexes = new Set(state.clickedHexes);
      if (newClickedHexes.has(key)) {
        newClickedHexes.delete(key);
      } else {
        newClickedHexes.add(key);
      }
      return { clickedHexes: newClickedHexes };
    }),
}));

export default useHexStore;
