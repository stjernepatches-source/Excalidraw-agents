// Title slide and section header templates

import { rectangle, text, line } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";
import { CANVAS } from "../core/layout.js";

/**
 * Hero title slide - big text, clean background.
 */
export function titleSlide({
  title = "Title",
  subtitle = "",
  x = 0,
  y = 0,
  width = CANVAS.width,
  height = CANVAS.height,
  bgColor = PALETTE.navy,
  textColor = PALETTE.white,
  accentColor = PALETTE.blue,
} = {}) {
  const elements = [];

  // Background
  elements.push(rectangle({
    x, y, width, height,
    fill: bgColor,
    stroke: bgColor,
    strokeWidth: 0,
    roundness: { type: 3, value: 20 },
  }));

  // Accent line
  elements.push(line({
    x: x + width / 2 - 60,
    y: y + height / 2 - 10,
    points: [[0, 0], [120, 0]],
    stroke: accentColor,
    strokeWidth: 4,
  }));

  // Title
  const titleFontSize = title.length > 30 ? 36 : 48;
  elements.push(text({
    x: x + width / 2 - (title.length * titleFontSize * 0.6) / 2,
    y: y + height / 2 - titleFontSize - 25,
    text: title,
    fontSize: titleFontSize,
    fontFamily: 2,
    color: textColor,
  }));

  // Subtitle
  if (subtitle) {
    elements.push(text({
      x: x + width / 2 - (subtitle.length * 18 * 0.6) / 2,
      y: y + height / 2 + 15,
      text: subtitle,
      fontSize: 18,
      fontFamily: 2,
      color: accentColor,
    }));
  }

  return elements;
}

/**
 * Section divider - smaller header for separating topics.
 */
export function sectionHeader({
  title = "Section",
  x = 60,
  y = 0,
  width = 500,
  accentColor = PALETTE.blue,
} = {}) {
  const elements = [];

  elements.push(line({
    x,
    y: y + 38,
    points: [[0, 0], [40, 0]],
    stroke: accentColor,
    strokeWidth: 4,
  }));

  elements.push(text({
    x: x + 55,
    y,
    text: title,
    fontSize: 32,
    fontFamily: 2,
    color: PALETTE.dark,
  }));

  return elements;
}
