// Layout helpers for positioning elements on the canvas

/**
 * Standard canvas dimensions used in Excalidraw presentations.
 * These are just defaults; Excalidraw is infinite canvas.
 */
export const CANVAS = {
  width: 1600,
  height: 900,
  padding: 60,
};

/** Get center coordinates for a given area */
export function center(areaWidth = CANVAS.width, areaHeight = CANVAS.height) {
  return { x: areaWidth / 2, y: areaHeight / 2 };
}

/**
 * Lay out items in a row with even spacing.
 * Returns array of { x, y } positions.
 */
export function row({ count, startX = CANVAS.padding, y = 0, itemWidth, gap = 30 }) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({ x: startX + i * (itemWidth + gap), y });
  }
  return positions;
}

/**
 * Lay out items in a column.
 */
export function column({ count, x = 0, startY = CANVAS.padding, itemHeight, gap = 20 }) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({ x, y: startY + i * (itemHeight + gap) });
  }
  return positions;
}

/**
 * Distribute items in a grid layout.
 */
export function grid({ cols, rows, startX = CANVAS.padding, startY = CANVAS.padding, itemWidth, itemHeight, gapX = 30, gapY = 30 }) {
  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push({
        x: startX + c * (itemWidth + gapX),
        y: startY + r * (itemHeight + gapY),
      });
    }
  }
  return positions;
}

/**
 * Calculate slide-level Y offset for multi-slide layouts.
 * Each "slide" is a CANVAS.height-tall section.
 */
export function slideY(slideIndex) {
  return slideIndex * (CANVAS.height + 100);
}
