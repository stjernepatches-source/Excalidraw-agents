// Side-by-side comparison template
// Perfect for "Traditional vs AI Front Desk" comparisons

import { rectangle, text, line } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Two-column comparison layout.
 */
export function comparison({
  title = "",
  leftTitle = "Traditional",
  rightTitle = "AI-Powered",
  leftColor = PALETTE.coral,
  rightColor = PALETTE.teal,
  items = [],  // [{left: "Manual check-in", right: "Automated check-in"}]
  x = 60,
  y = 60,
  width = 900,
} = {}) {
  const elements = [];
  const colWidth = (width - 40) / 2;
  const rightX = x + colWidth + 40;

  // Main title
  if (title) {
    elements.push(text({
      x: x + width / 2 - (title.length * 28 * 0.6) / 2,
      y,
      text: title,
      fontSize: 28,
      fontFamily: 2,
      color: PALETTE.dark,
    }));
    y += 50;
  }

  // Left column header
  elements.push(rectangle({
    x,
    y,
    width: colWidth,
    height: 50,
    fill: leftColor,
    stroke: leftColor,
    strokeWidth: 0,
    roundness: { type: 3, value: 10 },
  }));
  elements.push(text({
    x: x + colWidth / 2 - (leftTitle.length * 20 * 0.6) / 2,
    y: y + 12,
    text: leftTitle,
    fontSize: 20,
    fontFamily: 2,
    color: PALETTE.white,
  }));

  // Right column header
  elements.push(rectangle({
    x: rightX,
    y,
    width: colWidth,
    height: 50,
    fill: rightColor,
    stroke: rightColor,
    strokeWidth: 0,
    roundness: { type: 3, value: 10 },
  }));
  elements.push(text({
    x: rightX + colWidth / 2 - (rightTitle.length * 20 * 0.6) / 2,
    y: y + 12,
    text: rightTitle,
    fontSize: 20,
    fontFamily: 2,
    color: PALETTE.white,
  }));

  // Divider
  elements.push(line({
    x: x + colWidth + 20,
    y: y + 60,
    points: [[0, 0], [0, items.length * 70 + 10]],
    stroke: PALETTE.lightGrey,
    strokeWidth: 2,
    strokeStyle: "dashed",
  }));

  // Items
  items.forEach((item, i) => {
    const iy = y + 70 + i * 70;

    // Left item
    elements.push(rectangle({
      x: x + 5,
      y: iy,
      width: colWidth - 10,
      height: 55,
      fill: leftColor + "12",
      stroke: leftColor + "40",
      strokeWidth: 1,
      roundness: { type: 3, value: 8 },
    }));
    elements.push(text({
      x: x + 18,
      y: iy + 8,
      text: item.left,
      fontSize: 15,
      fontFamily: 2,
      color: PALETTE.dark,
    }));
    if (item.leftDetail) {
      elements.push(text({
        x: x + 18,
        y: iy + 32,
        text: item.leftDetail,
        fontSize: 12,
        fontFamily: 2,
        color: PALETTE.grey,
      }));
    }

    // Right item
    elements.push(rectangle({
      x: rightX + 5,
      y: iy,
      width: colWidth - 10,
      height: 55,
      fill: rightColor + "12",
      stroke: rightColor + "40",
      strokeWidth: 1,
      roundness: { type: 3, value: 8 },
    }));
    elements.push(text({
      x: rightX + 18,
      y: iy + 8,
      text: item.right,
      fontSize: 15,
      fontFamily: 2,
      color: PALETTE.dark,
    }));
    if (item.rightDetail) {
      elements.push(text({
        x: rightX + 18,
        y: iy + 32,
        text: item.rightDetail,
        fontSize: 12,
        fontFamily: 2,
        color: PALETTE.grey,
      }));
    }
  });

  return elements;
}

/**
 * Feature checklist comparison (✓ / ✗ grid).
 */
export function featureGrid({
  title = "",
  columns = ["Traditional", "AI-Powered"],
  features = [], // [{name: "24/7 Service", values: [false, true]}]
  x = 60,
  y = 60,
  width = 700,
} = {}) {
  const elements = [];
  const nameWidth = 250;
  const colWidth = (width - nameWidth) / columns.length;

  if (title) {
    elements.push(text({
      x, y,
      text: title,
      fontSize: 28,
      fontFamily: 2,
      color: PALETTE.dark,
    }));
    y += 50;
  }

  // Column headers
  columns.forEach((col, i) => {
    elements.push(text({
      x: x + nameWidth + i * colWidth + colWidth / 2 - (col.length * 16 * 0.6) / 2,
      y,
      text: col,
      fontSize: 16,
      fontFamily: 2,
      color: PALETTE.darkGrey,
    }));
  });

  y += 35;

  // Header line
  elements.push(line({
    x,
    y,
    points: [[0, 0], [width, 0]],
    stroke: PALETTE.lightGrey,
    strokeWidth: 1,
  }));

  // Features
  features.forEach((feat, i) => {
    const fy = y + 15 + i * 45;

    // Feature name
    elements.push(text({
      x: x + 10,
      y: fy,
      text: feat.name,
      fontSize: 15,
      fontFamily: 2,
      color: PALETTE.dark,
    }));

    // Check/cross for each column
    feat.values.forEach((val, j) => {
      const symbol = val ? "✓" : "✗";
      const color = val ? PALETTE.teal : PALETTE.coral;
      elements.push(text({
        x: x + nameWidth + j * colWidth + colWidth / 2 - 10,
        y: fy,
        text: symbol,
        fontSize: 22,
        fontFamily: 2,
        color,
      }));
    });

    // Row separator
    if (i < features.length - 1) {
      elements.push(line({
        x,
        y: fy + 35,
        points: [[0, 0], [width, 0]],
        stroke: PALETTE.lightGrey,
        strokeWidth: 1,
        opacity: 40,
      }));
    }
  });

  return elements;
}
