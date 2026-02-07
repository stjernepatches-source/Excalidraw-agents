// Stat card / KPI card visualization template
// Big numbers with labels - perfect for showing hotel metrics

import { rectangle, text } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Single large stat card with a big number and subtitle.
 */
export function statCard({
  x = 0, y = 0,
  width = 260, height = 160,
  value = "85%",
  label = "Check-in Time Saved",
  sublabel = "",
  color = PALETTE.blue,
  bgColor = null,
} = {}) {
  const elements = [];
  const bg = bgColor || color + "15"; // light tint

  // Card background
  elements.push(rectangle({
    x, y, width, height,
    fill: bg,
    stroke: color,
    strokeWidth: 2,
    roundness: { type: 3, value: 16 },
  }));

  // Big number
  elements.push(text({
    x: x + width / 2 - (value.length * 40 * 0.6) / 2,
    y: y + 25,
    text: value,
    fontSize: 44,
    fontFamily: 2,
    color: color,
  }));

  // Label
  elements.push(text({
    x: x + width / 2 - (label.length * 15 * 0.6) / 2,
    y: y + 85,
    text: label,
    fontSize: 15,
    fontFamily: 2,
    color: PALETTE.darkGrey,
  }));

  // Sublabel (optional)
  if (sublabel) {
    elements.push(text({
      x: x + width / 2 - (sublabel.length * 12 * 0.6) / 2,
      y: y + 115,
      text: sublabel,
      fontSize: 12,
      fontFamily: 2,
      color: PALETTE.grey,
    }));
  }

  return elements;
}

/**
 * Row of stat cards - a common KPI dashboard layout.
 */
export function statRow({
  stats = [],
  x = 60,
  y = 60,
  cardWidth = 260,
  cardHeight = 160,
  gap = 30,
  title = "",
} = {}) {
  const elements = [];

  if (title) {
    elements.push(text({
      x: x,
      y: y,
      text: title,
      fontSize: 28,
      fontFamily: 2,
      color: PALETTE.dark,
    }));
    y += 50;
  }

  stats.forEach((stat, i) => {
    elements.push(...statCard({
      x: x + i * (cardWidth + gap),
      y,
      width: cardWidth,
      height: cardHeight,
      ...stat,
    }));
  });

  return elements;
}
