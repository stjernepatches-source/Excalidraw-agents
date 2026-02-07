// Timeline / process flow visualization template
// Shows step-by-step processes like guest check-in flow

import { rectangle, text, arrow, ellipse } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Horizontal timeline/process flow.
 *
 * @param {Object} opts
 * @param {string} opts.title
 * @param {Array<{label: string, detail?: string, icon?: string, color?: string}>} opts.steps
 * @param {number} opts.x
 * @param {number} opts.y
 * @param {number} opts.width
 */
export function timeline({
  title = "Process Flow",
  steps = [],
  x = 60,
  y = 60,
  width = 1400,
} = {}) {
  const elements = [];
  const defaultColors = [PALETTE.blue, PALETTE.teal, PALETTE.purple, PALETTE.amber, PALETTE.coral, PALETTE.navy];

  // Title
  elements.push(text({
    x,
    y,
    text: title,
    fontSize: 28,
    fontFamily: 2,
    color: PALETTE.dark,
  }));

  if (steps.length === 0) return elements;

  const stepWidth = 160;
  const stepHeight = 80;
  const gap = (width - steps.length * stepWidth) / (steps.length - 1 || 1);
  const topY = y + 60;

  steps.forEach((step, i) => {
    const sx = x + i * (stepWidth + Math.min(gap, 60));
    const color = step.color || defaultColors[i % defaultColors.length];

    // Step number circle
    elements.push(ellipse({
      x: sx + stepWidth / 2 - 18,
      y: topY - 10,
      width: 36,
      height: 36,
      fill: color,
      stroke: color,
      strokeWidth: 0,
    }));

    elements.push(text({
      x: sx + stepWidth / 2 - 6,
      y: topY - 3,
      text: `${i + 1}`,
      fontSize: 18,
      fontFamily: 2,
      color: PALETTE.white,
      textAlign: "center",
    }));

    // Step box
    elements.push(rectangle({
      x: sx,
      y: topY + 40,
      width: stepWidth,
      height: stepHeight,
      fill: color + "18",
      stroke: color,
      strokeWidth: 2,
      roundness: { type: 3, value: 12 },
    }));

    // Step label
    elements.push(text({
      x: sx + 12,
      y: topY + 50,
      text: step.label,
      fontSize: 16,
      fontFamily: 2,
      color: PALETTE.dark,
    }));

    // Step detail (optional)
    if (step.detail) {
      elements.push(text({
        x: sx + 12,
        y: topY + 75,
        text: step.detail,
        fontSize: 12,
        fontFamily: 2,
        color: PALETTE.grey,
      }));
    }

    // Arrow to next step
    if (i < steps.length - 1) {
      const arrowStartX = sx + stepWidth + 5;
      const arrowEndX = x + (i + 1) * (stepWidth + Math.min(gap, 60)) - 5;
      elements.push(arrow({
        x: arrowStartX,
        y: topY + 40 + stepHeight / 2,
        points: [[0, 0], [arrowEndX - arrowStartX, 0]],
        stroke: PALETTE.lightGrey,
        strokeWidth: 2,
      }));
    }
  });

  return elements;
}

/**
 * Vertical timeline for before/after comparisons.
 */
export function verticalTimeline({
  title = "",
  steps = [],
  x = 60,
  y = 60,
} = {}) {
  const elements = [];

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

  const lineX = x + 20;
  const contentX = x + 60;

  // Vertical line
  if (steps.length > 1) {
    elements.push({
      ...arrow({
        x: lineX,
        y: y + 10,
        points: [[0, 0], [0, steps.length * 90 - 30]],
        stroke: PALETTE.lightGrey,
        strokeWidth: 2,
      }),
      endArrowhead: null,
    });
  }

  steps.forEach((step, i) => {
    const sy = y + i * 90;
    const color = step.color || PALETTE.blue;

    // Dot on timeline
    elements.push(ellipse({
      x: lineX - 8,
      y: sy + 4,
      width: 16,
      height: 16,
      fill: color,
      stroke: color,
      strokeWidth: 0,
    }));

    // Label
    elements.push(text({
      x: contentX,
      y: sy,
      text: step.label,
      fontSize: 18,
      fontFamily: 2,
      color: PALETTE.dark,
    }));

    // Detail
    if (step.detail) {
      elements.push(text({
        x: contentX,
        y: sy + 28,
        text: step.detail,
        fontSize: 13,
        fontFamily: 2,
        color: PALETTE.grey,
      }));
    }
  });

  return elements;
}
