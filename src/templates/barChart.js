// Bar chart visualization template
// Creates clean, modern horizontal or vertical bar charts

import { rectangle, text, line } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Generate a vertical bar chart.
 *
 * @param {Object} opts
 * @param {string} opts.title - Chart title
 * @param {Array<{label: string, value: number, color?: string}>} opts.data
 * @param {number} opts.x - X position on canvas
 * @param {number} opts.y - Y position on canvas
 * @param {number} opts.width - Total chart width
 * @param {number} opts.height - Total chart height
 * @param {string} opts.unit - Unit suffix (e.g., "%", "hrs", "$")
 * @param {boolean} opts.showValues - Show value labels on bars
 */
export function barChart({
  title = "Chart",
  data = [],
  x = 60,
  y = 60,
  width = 700,
  height = 400,
  unit = "",
  showValues = true,
} = {}) {
  const elements = [];
  const defaultColors = [PALETTE.blue, PALETTE.teal, PALETTE.coral, PALETTE.amber, PALETTE.purple, PALETTE.navy];

  // Title
  elements.push(text({
    x: x + width / 2 - (title.length * 14 * 0.6) / 2,
    y: y,
    text: title,
    fontSize: 28,
    fontFamily: 2, // Helvetica
    color: PALETTE.dark,
  }));

  const chartTop = y + 55;
  const chartBottom = y + height - 40;
  const chartLeft = x + 60;
  const chartRight = x + width - 30;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = chartRight - chartLeft;

  // Y-axis
  elements.push(line({
    x: chartLeft,
    y: chartTop,
    points: [[0, 0], [0, chartHeight]],
    stroke: PALETTE.lightGrey,
    strokeWidth: 1,
  }));

  // X-axis
  elements.push(line({
    x: chartLeft,
    y: chartBottom,
    points: [[0, 0], [chartWidth, 0]],
    stroke: PALETTE.lightGrey,
    strokeWidth: 1,
  }));

  if (data.length === 0) return elements;

  const maxVal = Math.max(...data.map(d => d.value));
  const barGap = 20;
  const barWidth = Math.min(80, (chartWidth - barGap * (data.length + 1)) / data.length);
  const totalBarsWidth = data.length * barWidth + (data.length - 1) * barGap;
  const startOffset = (chartWidth - totalBarsWidth) / 2;

  // Grid lines (3 horizontal)
  for (let i = 1; i <= 3; i++) {
    const gridY = chartTop + (chartHeight / 4) * i;
    elements.push(line({
      x: chartLeft,
      y: gridY,
      points: [[0, 0], [chartWidth, 0]],
      stroke: PALETTE.lightGrey,
      strokeWidth: 1,
      strokeStyle: "dashed",
      opacity: 50,
    }));
  }

  // Bars + labels
  data.forEach((item, i) => {
    const barHeight = (item.value / maxVal) * (chartHeight - 20);
    const barX = chartLeft + startOffset + i * (barWidth + barGap);
    const barY = chartBottom - barHeight;
    const color = item.color || defaultColors[i % defaultColors.length];

    // Bar
    elements.push(rectangle({
      x: barX,
      y: barY,
      width: barWidth,
      height: barHeight,
      fill: color,
      stroke: color,
      strokeWidth: 0,
      roundness: { type: 3, value: 6 },
    }));

    // Value label on top of bar
    if (showValues) {
      const valText = `${item.value}${unit}`;
      elements.push(text({
        x: barX + barWidth / 2 - (valText.length * 16 * 0.6) / 2,
        y: barY - 28,
        text: valText,
        fontSize: 16,
        fontFamily: 2,
        color: PALETTE.dark,
      }));
    }

    // X-axis label
    elements.push(text({
      x: barX + barWidth / 2 - (item.label.length * 13 * 0.6) / 2,
      y: chartBottom + 10,
      text: item.label,
      fontSize: 13,
      fontFamily: 2,
      color: PALETTE.grey,
    }));
  });

  return elements;
}

/**
 * Generate a comparison bar chart (before/after, side-by-side).
 */
export function comparisonBars({
  title = "Before vs After",
  beforeLabel = "Before",
  afterLabel = "After",
  data = [],
  x = 60,
  y = 60,
  width = 700,
  height = 400,
  unit = "",
  beforeColor = PALETTE.coral,
  afterColor = PALETTE.teal,
} = {}) {
  const elements = [];

  // Title
  elements.push(text({
    x: x + width / 2 - (title.length * 28 * 0.6) / 2,
    y,
    text: title,
    fontSize: 28,
    fontFamily: 2,
    color: PALETTE.dark,
  }));

  // Legend
  elements.push(rectangle({ x: x + width - 250, y: y + 5, width: 16, height: 16, fill: beforeColor, stroke: beforeColor, strokeWidth: 0 }));
  elements.push(text({ x: x + width - 228, y: y + 3, text: beforeLabel, fontSize: 14, fontFamily: 2, color: PALETTE.grey }));
  elements.push(rectangle({ x: x + width - 130, y: y + 5, width: 16, height: 16, fill: afterColor, stroke: afterColor, strokeWidth: 0 }));
  elements.push(text({ x: x + width - 108, y: y + 3, text: afterLabel, fontSize: 14, fontFamily: 2, color: PALETTE.grey }));

  const chartTop = y + 60;
  const chartBottom = y + height - 40;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = width - 120;
  const chartLeft = x + 60;

  const maxVal = Math.max(...data.flatMap(d => [d.before, d.after]));
  const groupWidth = chartWidth / data.length;
  const barWidth = groupWidth * 0.3;
  const groupGap = groupWidth * 0.15;

  data.forEach((item, i) => {
    const groupX = chartLeft + i * groupWidth + groupGap;

    // Before bar
    const bH = (item.before / maxVal) * (chartHeight - 20);
    elements.push(rectangle({
      x: groupX,
      y: chartBottom - bH,
      width: barWidth,
      height: bH,
      fill: beforeColor,
      stroke: beforeColor,
      strokeWidth: 0,
      roundness: { type: 3, value: 6 },
    }));
    elements.push(text({
      x: groupX + barWidth / 2 - 15,
      y: chartBottom - bH - 25,
      text: `${item.before}${unit}`,
      fontSize: 14,
      fontFamily: 2,
      color: PALETTE.dark,
    }));

    // After bar
    const aH = (item.after / maxVal) * (chartHeight - 20);
    elements.push(rectangle({
      x: groupX + barWidth + 8,
      y: chartBottom - aH,
      width: barWidth,
      height: aH,
      fill: afterColor,
      stroke: afterColor,
      strokeWidth: 0,
      roundness: { type: 3, value: 6 },
    }));
    elements.push(text({
      x: groupX + barWidth + 8 + barWidth / 2 - 15,
      y: chartBottom - aH - 25,
      text: `${item.after}${unit}`,
      fontSize: 14,
      fontFamily: 2,
      color: PALETTE.dark,
    }));

    // Category label
    elements.push(text({
      x: groupX + barWidth,
      y: chartBottom + 10,
      text: item.label,
      fontSize: 13,
      fontFamily: 2,
      color: PALETTE.grey,
      textAlign: "center",
    }));
  });

  return elements;
}
