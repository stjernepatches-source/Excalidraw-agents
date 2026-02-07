// Script / joke line generator
// Adds light grey teleprompter-style text for presenter talking points

import { text, rectangle } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";

/**
 * Add a light grey script line (talking point / joke).
 * These are very subtle and meant as presenter notes.
 *
 * @param {Object} opts
 * @param {string} opts.text - The script/joke text
 * @param {number} opts.x
 * @param {number} opts.y
 * @param {string} opts.type - "joke" | "talking-point" | "transition"
 * @param {number} opts.maxWidth - Max width before wrapping
 */
export function scriptLine({
  text: content = "",
  x = 60,
  y = 0,
  type = "talking-point",
  maxWidth = 600,
} = {}) {
  const elements = [];
  const color = PALETTE.script; // very light grey

  // Prefix based on type
  const prefixes = {
    "joke": "😄  ",
    "talking-point": "💬  ",
    "transition": "→  ",
  };
  const prefix = prefixes[type] || "";

  // Wrap text to maxWidth
  const fontSize = 14;
  const charWidth = fontSize * 0.55;
  const maxChars = Math.floor(maxWidth / charWidth);
  const words = content.split(" ");
  const lines = [];
  let currentLine = prefix;

  for (const word of words) {
    if ((currentLine + " " + word).length > maxChars && currentLine.length > prefix.length) {
      lines.push(currentLine);
      currentLine = "    " + word; // indent continuation
    } else {
      currentLine += (currentLine.length > prefix.length ? " " : "") + word;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  const fullText = lines.join("\n");

  elements.push(text({
    x,
    y,
    text: fullText,
    fontSize,
    fontFamily: 2,  // Helvetica - clean and readable
    color,
    opacity: 60,    // extra subtle
  }));

  return elements;
}

/**
 * Add a block of script lines (multiple jokes/talking points).
 */
export function scriptBlock({
  lines = [],
  x = 60,
  y = 0,
  gap = 35,
} = {}) {
  const elements = [];

  lines.forEach((line, i) => {
    const lineText = typeof line === "string" ? line : line.text;
    const lineType = typeof line === "string" ? "talking-point" : (line.type || "talking-point");

    elements.push(...scriptLine({
      text: lineText,
      x,
      y: y + i * gap,
      type: lineType,
    }));
  });

  return elements;
}

// ── Pre-written hotel front desk jokes and talking points ─────────────────

export const HOTEL_JOKES = {
  checkin: [
    "At least the AI won't judge you for arriving at 3 AM and asking for extra pillows",
    "Fun fact: The average guest spends more time checking in than it takes to fly from London to Paris",
    "Self check-in kiosks: because nothing says 'welcome' like a touchscreen that definitely hasn't been cleaned today",
  ],
  costs: [
    "That's roughly the cost of one front desk employee's coffee budget... per quarter",
    "If you're spending this much on night shifts, your receptionist better be solving world peace between check-ins",
    "The only thing more expensive than a 24/7 front desk is pretending you don't need one",
  ],
  timeSaving: [
    "That's enough saved time to finally answer all those TripAdvisor reviews from 2019",
    "With that time saved, your staff could actually learn everyone's name. Revolutionary, right?",
    "Time saved = time your staff can spend making guests feel like actual humans, not booking numbers",
  ],
  guestExperience: [
    "Plot twist: guests actually prefer NOT waiting in line. Groundbreaking research here, folks",
    "A 4 AM check-in without human interaction? Introverts, this one's for you",
    "Nothing kills the vacation vibe faster than filling out a form that asks for your fax number",
  ],
  general: [
    "Hotels have been doing check-in the same way since... well, since there were hotels",
    "Remember when the biggest hotel tech innovation was the key card? Good times",
    "If your front desk software is older than your guests' kids, we need to talk",
  ],
};

/**
 * Pick a random joke from a category.
 */
export function randomJoke(category = "general") {
  const jokes = HOTEL_JOKES[category] || HOTEL_JOKES.general;
  return jokes[Math.floor(Math.random() * jokes.length)];
}
