// src/store/slices/viewportSlice.js

/**
 * Viewport slice for managing screen size, orientation, and board size optimization.
 */

/**
 * @typedef {'portrait'|'landscape'} Orientation
 */

/**
 * @typedef {Object} ViewportState
 * @property {number} width - The current viewport width
 * @property {number} height - The current viewport height
 * @property {Orientation} orientation - The current device orientation
 */

/**
 * Creates the viewport slice for the Zustand store
 * @param {function} set - Zustand's set function
 * @param {function} get - Zustand's get function
 * @returns {Object} The viewport slice methods and properties
 */
export const createViewportSlice = (set, get) => ({
  /** @type {ViewportState} */
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

  /**
   * Calculates the optimal board size based on current viewport
   * @returns {{width: number, height: number}} The optimal board dimensions
   */
  getOptimalBoardSize: () => {
    const { viewport } = get();
    const aspectRatio = viewport.width / viewport.height;

    if (viewport.orientation === "landscape") {
      return {
        width: Math.max(7, Math.min(11, Math.floor(aspectRatio * 7))),
        height: 7,
      };
    } else {
      return {
        width: 7,
        height: Math.max(7, Math.min(11, Math.floor(7 / aspectRatio))),
      };
    }
  },
});

// Usage example:
/*
  const useStore = create((set, get) => ({
    ...createViewportSlice(set, get),
    // ... other slices
  }));
  
  // In a React component:
  const { viewport, initViewportListeners, getOptimalBoardSize } = useStore();
  
  useEffect(() => {
    const cleanup = initViewportListeners();
    return cleanup;
  }, [initViewportListeners]);
  
  console.log('Current viewport:', viewport);
  console.log('Optimal board size:', getOptimalBoardSize());
  */
