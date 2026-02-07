// Excalidraw Hotel Visualizer - Main API
// ─────────────────────────────────────────────────────────────────────────

// Core
export { Scene } from "./core/scene.js";
export { rectangle, ellipse, diamond, text, arrow, line, image, uid } from "./core/elements.js";
export { PALETTE, THEMES } from "./core/colors.js";
export { CANVAS, center, row, column, grid, slideY } from "./core/layout.js";

// Templates
export { barChart, comparisonBars } from "./templates/barChart.js";
export { statCard, statRow } from "./templates/statCard.js";
export { timeline, verticalTimeline } from "./templates/timeline.js";
export { comparison, featureGrid } from "./templates/comparison.js";
export { scriptLine, scriptBlock, randomJoke, HOTEL_JOKES } from "./templates/scriptLine.js";
export { imagePanel, imagePlaceholder } from "./templates/imagePanel.js";
export { titleSlide, sectionHeader } from "./templates/titleSlide.js";

// Hotel-specific presets
export { generateHotelSheet } from "./presets/hotelSheets.js";
