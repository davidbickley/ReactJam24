// src/store/slices/viewportSlice.js

export const createViewportSlice = (set, get) => ({
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation:
      window.innerHeight > window.innerWidth ? "portrait" : "landscape",
  },

  updateViewport: () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = height > width ? "portrait" : "landscape";
    set({ viewport: { width, height, orientation } });
  },

  initViewportListeners: () => {
    const { updateViewport } = get();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  },

  getBoardSize: () => {
    const { viewport } = get();
    const aspectRatio = viewport.width / viewport.height;
    const baseSize = 6;
    let width, height;

    if (aspectRatio > 1) {
      // Landscape
      width = Math.floor(aspectRatio * baseSize);
      height = baseSize;
    } else {
      // Portrait
      width = baseSize;
      height = Math.floor(baseSize / aspectRatio);
    }

    // Ensure width and height are even numbers
    width = Math.floor(width / 2) * 2;
    height = Math.floor(height / 2) * 2;

    // Cap the maximum size
    width = Math.min(width, 24);
    height = Math.min(height, 24);

    console.log("getBoardSize:", { width, height }); // Added this log

    return { width, height };
  },
});
