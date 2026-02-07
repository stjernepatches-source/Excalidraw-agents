#!/usr/bin/env node

// Example: Build a custom Excalidraw sheet using the API
// Run: node examples/custom-sheet.js

import { writeFile } from "fs/promises";
import {
  Scene,
  text,
  rectangle,
  PALETTE,
  titleSlide,
  sectionHeader,
  statRow,
  barChart,
  comparison,
  timeline,
  featureGrid,
  scriptBlock,
  imagePlaceholder,
  randomJoke,
  slideY,
} from "../src/index.js";

const scene = new Scene();

// ── Slide 1: Your custom title ──────────────────────────────────────────

scene.add(titleSlide({
  title: "Why Hotels Need AI Now",
  subtitle: "A data-driven breakdown for 2025",
}));

// ── Slide 2: Your own stats ─────────────────────────────────────────────

const y2 = slideY(1);
scene.add(...sectionHeader({ title: "The Market Reality", y: y2 }));

scene.add(...statRow({
  y: y2 + 70,
  stats: [
    { value: "68%", label: "Hotels Still Manual", color: PALETTE.coral },
    { value: "€3.2B", label: "Market Opportunity", color: PALETTE.blue },
    { value: "40%", label: "Staff Turnover Rate", color: PALETTE.amber },
  ],
  cardWidth: 320,
}));

// Add a joke/script line
scene.add(...scriptBlock({
  lines: [
    { text: "68% — that means if you're watching this, you're probably in that majority", type: "talking-point" },
    { text: randomJoke("general"), type: "joke" },
  ],
  x: 60,
  y: y2 + 300,
}));

// ── Slide 3: Custom bar chart ───────────────────────────────────────────

const y3 = slideY(2);
scene.add(...sectionHeader({ title: "Guest Satisfaction Scores", y: y3 }));

scene.add(...barChart({
  title: "Average Rating by Check-in Method",
  data: [
    { label: "Traditional", value: 3.9, color: PALETTE.coral },
    { label: "Kiosk Only", value: 4.1, color: PALETTE.amber },
    { label: "AI + Kiosk", value: 4.6, color: PALETTE.teal },
    { label: "AI + App", value: 4.8, color: PALETTE.blue },
  ],
  x: 80,
  y: y3 + 70,
  unit: "★",
}));

// Image placeholder next to the chart
scene.add(...imagePlaceholder({
  x: 900,
  y: y3 + 100,
  width: 400,
  height: 300,
  label: "📷 Guest using mobile check-in",
}));

// ── Save ────────────────────────────────────────────────────────────────

await writeFile("output/custom-example.excalidraw", scene.toString());
console.log("✅ Created output/custom-example.excalidraw");
console.log("   Open it at https://excalidraw.com");
