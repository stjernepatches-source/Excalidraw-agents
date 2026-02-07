// Image panel template
// Adds images with optional captions and decorative frames

import { rectangle, text, image } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Create an image panel with an optional caption.
 * Note: The image must first be added to the scene via scene.addImageFile()
 * or scene.addImageData() to get a fileId.
 *
 * @param {Object} opts
 * @param {string} opts.fileId - File ID from scene.addImageFile()
 * @param {number} opts.x
 * @param {number} opts.y
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {string} opts.caption
 * @param {boolean} opts.shadow - Add a shadow-like border
 */
export function imagePanel({
  fileId,
  x = 0,
  y = 0,
  width = 400,
  height = 300,
  caption = "",
  shadow = true,
  rounded = true,
} = {}) {
  const elements = [];

  // Shadow/border rectangle behind the image
  if (shadow) {
    elements.push(rectangle({
      x: x - 4,
      y: y - 4,
      width: width + 8,
      height: height + 8 + (caption ? 40 : 0),
      fill: PALETTE.white,
      stroke: PALETTE.lightGrey,
      strokeWidth: 1,
      roundness: rounded ? { type: 3, value: 12 } : null,
    }));
  }

  // The image element
  elements.push(image({
    fileId,
    x,
    y,
    width,
    height,
  }));

  // Caption
  if (caption) {
    elements.push(text({
      x: x + 10,
      y: y + height + 8,
      text: caption,
      fontSize: 13,
      fontFamily: 2,
      color: PALETTE.grey,
    }));
  }

  return elements;
}

/**
 * Create a placeholder rectangle where an image should go.
 * Useful for generating layouts before you have the actual images.
 */
export function imagePlaceholder({
  x = 0,
  y = 0,
  width = 400,
  height = 300,
  label = "📷 Add image here",
  caption = "",
} = {}) {
  const elements = [];

  // Placeholder box
  elements.push(rectangle({
    x, y, width, height,
    fill: PALETTE.offWhite,
    stroke: PALETTE.lightGrey,
    strokeWidth: 2,
    strokeStyle: "dashed",
    roundness: { type: 3, value: 12 },
  }));

  // Placeholder text
  elements.push(text({
    x: x + width / 2 - (label.length * 16 * 0.6) / 2,
    y: y + height / 2 - 10,
    text: label,
    fontSize: 16,
    fontFamily: 2,
    color: PALETTE.grey,
  }));

  if (caption) {
    elements.push(text({
      x: x + 10,
      y: y + height + 8,
      text: caption,
      fontSize: 13,
      fontFamily: 2,
      color: PALETTE.grey,
    }));
  }

  return elements;
}
