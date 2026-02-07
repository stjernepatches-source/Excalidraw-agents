// Pre-built hotel front desk AI visualization sheets
// Each generates a complete .excalidraw scene ready for YouTube presentations

import { Scene } from "../core/scene.js";
import { text } from "../core/elements.js";
import { PALETTE } from "../core/colors.js";
import { CANVAS, slideY } from "../core/layout.js";

import { titleSlide, sectionHeader } from "../templates/titleSlide.js";
import { statRow } from "../templates/statCard.js";
import { barChart, comparisonBars } from "../templates/barChart.js";
import { timeline } from "../templates/timeline.js";
import { comparison, featureGrid } from "../templates/comparison.js";
import { scriptBlock, randomJoke } from "../templates/scriptLine.js";
import { imagePlaceholder } from "../templates/imagePanel.js";

// ── Preset: ROI & Cost Savings ────────────────────────────────────────────

function roiSheet() {
  const scene = new Scene();
  let y = 0;

  // Slide 1: Title
  scene.add(titleSlide({
    title: "AI Front Desk: The Numbers",
    subtitle: "How much time and money are you really saving?",
    y,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("general"), type: "joke" },
    ],
    x: 60,
    y: y + CANVAS.height + 20,
  }));

  y = slideY(1);

  // Slide 2: Key stats
  scene.add(...sectionHeader({ title: "Key Metrics", y }));
  scene.add(...statRow({
    y: y + 70,
    stats: [
      { value: "73%", label: "Less Time at Check-in", sublabel: "From 8 min to 2.2 min avg", color: PALETTE.teal },
      { value: "€47K", label: "Annual Savings", sublabel: "Per 50-room property", color: PALETTE.blue },
      { value: "24/7", label: "Always Available", sublabel: "No night shift needed", color: PALETTE.purple },
      { value: "4.6★", label: "Guest Satisfaction", sublabel: "Up from 3.9★ average", color: PALETTE.amber },
    ],
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "Let me break these numbers down for you", type: "talking-point" },
      { text: randomJoke("costs"), type: "joke" },
    ],
    x: 60,
    y: y + 310,
  }));

  y = slideY(2);

  // Slide 3: Cost comparison chart
  scene.add(...sectionHeader({ title: "Cost Breakdown", y }));
  scene.add(...comparisonBars({
    title: "Monthly Operating Costs",
    beforeLabel: "Traditional",
    afterLabel: "AI-Powered",
    data: [
      { label: "Staff", before: 8500, after: 3200 },
      { label: "Night shift", before: 4200, after: 0 },
      { label: "Training", before: 1500, after: 200 },
      { label: "Errors/Comps", before: 800, after: 150 },
    ],
    x: 80,
    y: y + 70,
    unit: "€",
  }));

  // Image placeholder for a fun hotel pic
  scene.add(...imagePlaceholder({
    x: 900,
    y: y + 100,
    width: 350,
    height: 250,
    label: "📷 Add hotel lobby photo",
    caption: "Your beautiful lobby, minus the queue",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("costs"), type: "joke" },
      { text: "Night shift alone - look at these numbers", type: "talking-point" },
    ],
    x: 900,
    y: y + 400,
  }));

  y = slideY(3);

  // Slide 4: Time savings bar chart
  scene.add(...sectionHeader({ title: "Time Savings Per Task", y }));
  scene.add(...barChart({
    title: "Minutes Per Guest Interaction",
    data: [
      { label: "Check-in", value: 8, color: PALETTE.coral },
      { label: "Check-out", value: 5, color: PALETTE.coral },
      { label: "AI Check-in", value: 2.2, color: PALETTE.teal },
      { label: "AI Check-out", value: 0.5, color: PALETTE.teal },
      { label: "Room info", value: 3, color: PALETTE.coral },
      { label: "AI Room info", value: 0.3, color: PALETTE.teal },
    ],
    x: 80,
    y: y + 70,
    width: 800,
    height: 400,
    unit: " min",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("timeSaving"), type: "joke" },
    ],
    x: 950,
    y: y + 200,
  }));

  return scene;
}

// ── Preset: Guest Journey ─────────────────────────────────────────────────

function guestJourneySheet() {
  const scene = new Scene();
  let y = 0;

  scene.add(titleSlide({
    title: "The Modern Guest Journey",
    subtitle: "From booking to checkout — fully automated",
    y,
    bgColor: PALETTE.navy,
  }));

  y = slideY(1);

  // Traditional check-in flow
  scene.add(...sectionHeader({ title: "Traditional Check-in Flow", y, accentColor: PALETTE.coral }));
  scene.add(...timeline({
    steps: [
      { label: "Arrive at hotel", detail: "After a long trip" },
      { label: "Wait in queue", detail: "5-15 min at peak", color: PALETTE.coral },
      { label: "Show ID", detail: "Manual verification" },
      { label: "Fill forms", detail: "Name, address, etc.", color: PALETTE.coral },
      { label: "Wait for key", detail: "System processing" },
      { label: "Get room info", detail: "Verbal explanation" },
    ],
    x: 60,
    y: y + 50,
    width: 1400,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("checkin"), type: "joke" },
      { text: "We've all been there — you just want to get to your room", type: "talking-point" },
    ],
    x: 60,
    y: y + 250,
  }));

  y = slideY(2);

  // AI-powered check-in flow
  scene.add(...sectionHeader({ title: "AI-Powered Check-in", y, accentColor: PALETTE.teal }));
  scene.add(...timeline({
    steps: [
      { label: "Pre-check-in", detail: "Done on phone", color: PALETTE.teal },
      { label: "Arrive at hotel", detail: "Walk right in" },
      { label: "Tap phone/kiosk", detail: "2 seconds", color: PALETTE.teal },
      { label: "Room assigned", detail: "AI optimized", color: PALETTE.teal },
      { label: "Digital key", detail: "Instant on phone" },
    ],
    x: 60,
    y: y + 50,
    width: 1400,
  }));

  scene.add(...imagePlaceholder({
    x: 1050,
    y: y + 250,
    width: 350,
    height: 250,
    label: "📷 Phone check-in screenshot",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("guestExperience"), type: "joke" },
    ],
    x: 60,
    y: y + 280,
  }));

  y = slideY(3);

  // Feature comparison
  scene.add(...featureGrid({
    title: "Feature Comparison",
    columns: ["Traditional", "AI-Powered"],
    features: [
      { name: "24/7 Check-in Available", values: [false, true] },
      { name: "No Queue Wait Time", values: [false, true] },
      { name: "Multi-language Support", values: [false, true] },
      { name: "Automatic ID Verification", values: [false, true] },
      { name: "Digital Room Key", values: [false, true] },
      { name: "Personalized Room Assignment", values: [false, true] },
      { name: "Instant Billing/Receipt", values: [false, true] },
      { name: "Human Touch for Special Requests", values: [true, true] },
    ],
    x: 60,
    y: y + 40,
    width: 700,
  }));

  scene.add(...imagePlaceholder({
    x: 850,
    y: y + 80,
    width: 400,
    height: 300,
    label: "📷 Happy guest with phone key",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "Notice both still have 'human touch' — AI handles the boring stuff", type: "talking-point" },
      { text: randomJoke("general"), type: "joke" },
    ],
    x: 850,
    y: y + 420,
  }));

  return scene;
}

// ── Preset: Before/After Comparison ───────────────────────────────────────

function beforeAfterSheet() {
  const scene = new Scene();
  let y = 0;

  scene.add(titleSlide({
    title: "Before & After AI",
    subtitle: "What actually changes when you automate your front desk",
    y,
  }));

  y = slideY(1);

  scene.add(...comparison({
    title: "Daily Operations",
    leftTitle: "❌  Without AI",
    rightTitle: "✅  With AI",
    leftColor: PALETTE.coral,
    rightColor: PALETTE.teal,
    items: [
      {
        left: "Manual check-in for every guest",
        leftDetail: "8 minutes average, queues at peak",
        right: "Self-service + AI verification",
        rightDetail: "Under 2 minutes, no queues",
      },
      {
        left: "Night receptionist required",
        leftDetail: "€3,500–€4,200/month extra",
        right: "AI handles night arrivals",
        rightDetail: "Kiosk + chatbot, zero extra staff cost",
      },
      {
        left: "Language barriers",
        leftDetail: "Staff speaks 2-3 languages",
        right: "50+ languages instant",
        rightDetail: "AI translates in real-time",
      },
      {
        left: "Paper forms & manual data entry",
        leftDetail: "Errors, delays, GDPR headaches",
        right: "Digital forms, auto-filled",
        rightDetail: "Pre-arrival data collection",
      },
      {
        left: "Phone calls for every request",
        leftDetail: "Staff interrupted constantly",
        right: "AI chatbot for common requests",
        rightDetail: "Staff handles only complex issues",
      },
    ],
    x: 60,
    y,
    width: 1000,
  }));

  scene.add(...imagePlaceholder({
    x: 1100,
    y: y + 50,
    width: 380,
    height: 260,
    label: "📷 Before: crowded reception",
  }));

  scene.add(...imagePlaceholder({
    x: 1100,
    y: y + 360,
    width: 380,
    height: 260,
    label: "📷 After: calm, modern lobby",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("guestExperience"), type: "joke" },
      { text: "This is the real before and after — not just numbers, the daily experience", type: "talking-point" },
    ],
    x: 60,
    y: y + 520,
  }));

  y = slideY(2);

  // Revenue impact stats
  scene.add(...sectionHeader({ title: "Revenue Impact", y }));
  scene.add(...statRow({
    y: y + 70,
    stats: [
      { value: "+22%", label: "Upsell Revenue", sublabel: "AI-powered room upgrades", color: PALETTE.teal },
      { value: "-62%", label: "Staffing Costs", sublabel: "Redeploy to guest experience", color: PALETTE.blue },
      { value: "+31%", label: "Positive Reviews", sublabel: "Faster = happier guests", color: PALETTE.amber },
    ],
    cardWidth: 320,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "The upsell number is the one that surprises most hotel owners", type: "talking-point" },
      { text: randomJoke("costs"), type: "joke" },
    ],
    x: 60,
    y: y + 310,
  }));

  return scene;
}

// ── Main generator ────────────────────────────────────────────────────────

const PRESETS = {
  roi: { fn: roiSheet, desc: "ROI & cost savings analysis" },
  journey: { fn: guestJourneySheet, desc: "Guest journey flow comparison" },
  "before-after": { fn: beforeAfterSheet, desc: "Before/after AI comparison" },
};

/**
 * Generate a complete hotel visualization sheet.
 *
 * @param {string} preset - One of: "roi", "journey", "before-after", or "all"
 * @returns {Object|Object[]} Scene object(s) with .toJSON() / .toString()
 */
export function generateHotelSheet(preset = "roi") {
  if (preset === "all") {
    return Object.entries(PRESETS).map(([key, { fn, desc }]) => ({
      name: key,
      description: desc,
      scene: fn(),
    }));
  }

  const entry = PRESETS[preset];
  if (!entry) {
    const available = Object.keys(PRESETS).join(", ");
    throw new Error(`Unknown preset "${preset}". Available: ${available}, all`);
  }

  return entry.fn();
}

export { PRESETS };
