// Prompt interpreter: maps natural language to visualization templates
// Keyword-based matching with smart defaults for hotel front desk content

import { Scene } from "../src/core/scene.js";
import { text } from "../src/core/elements.js";
import { PALETTE } from "../src/core/colors.js";
import { slideY } from "../src/core/layout.js";

import { titleSlide, sectionHeader } from "../src/templates/titleSlide.js";
import { statCard, statRow } from "../src/templates/statCard.js";
import { barChart, comparisonBars } from "../src/templates/barChart.js";
import { timeline, verticalTimeline } from "../src/templates/timeline.js";
import { comparison, featureGrid } from "../src/templates/comparison.js";
import { scriptBlock, randomJoke } from "../src/templates/scriptLine.js";
import { imagePlaceholder } from "../src/templates/imagePanel.js";
import { generateHotelSheet } from "../src/presets/hotelSheets.js";

// ── Keyword detection ─────────────────────────────────────────────────────

function detect(prompt, keywords) {
  const lower = prompt.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function extractNumbers(prompt) {
  const numbers = prompt.match(/\d+\.?\d*/g);
  return numbers ? numbers.map(Number) : [];
}

// ── Main interpreter ──────────────────────────────────────────────────────

export function interpretPrompt(prompt) {
  const lower = prompt.toLowerCase();

  // ── Preset shortcuts ──────────────────────────────────────────────────

  if (detect(prompt, ["roi", "return on investment", "cost saving", "cost analysis", "how much money", "how much save"])) {
    return buildROI(prompt);
  }

  if (detect(prompt, ["guest journey", "check-in flow", "check-in process", "guest flow", "booking to checkout"])) {
    return buildGuestJourney(prompt);
  }

  if (detect(prompt, ["before and after", "before vs after", "before/after", "with and without", "with vs without"])) {
    return buildBeforeAfter(prompt);
  }

  if (detect(prompt, ["time saving", "time per", "minutes per", "how long", "how fast", "speed"])) {
    return buildTimeSavings(prompt);
  }

  if (detect(prompt, ["feature comparison", "feature grid", "what traditional", "what ai offers", "capabilities"])) {
    return buildFeatureComparison(prompt);
  }

  if (detect(prompt, ["revenue", "upsell", "income", "money made", "revenue impact"])) {
    return buildRevenueImpact(prompt);
  }

  if (detect(prompt, ["bar chart", "chart", "graph"])) {
    return buildCustomChart(prompt);
  }

  if (detect(prompt, ["stat", "kpi", "metric", "number", "dashboard"])) {
    return buildCustomStats(prompt);
  }

  if (detect(prompt, ["timeline", "process", "flow", "step"])) {
    return buildCustomTimeline(prompt);
  }

  if (detect(prompt, ["comparison", "compare", "versus", " vs "])) {
    return buildCustomComparison(prompt);
  }

  // ── Default: generate the full ROI sheet ──────────────────────────────

  return buildSmartDefault(prompt);
}

// ── Builder functions ─────────────────────────────────────────────────────

function buildROI(prompt) {
  const scene = generateHotelSheet("roi");
  return {
    message:
      "Here's your ROI analysis! It shows:\n" +
      "• Key metrics (time saved, annual savings, availability, satisfaction)\n" +
      "• Monthly cost comparison (staff, night shift, training, errors)\n" +
      "• Time per guest interaction chart\n\n" +
      "Light grey text = your script lines and jokes. Edit any numbers directly on the canvas.",
    scene: scene.toJSON(),
  };
}

function buildGuestJourney(prompt) {
  const scene = generateHotelSheet("journey");
  return {
    message:
      "Here's the guest journey comparison! It includes:\n" +
      "• Traditional check-in flow (6 steps — the painful way)\n" +
      "• AI-powered check-in flow (5 steps — the fast way)\n" +
      "• Feature comparison grid (✓/✗)\n\n" +
      "Scroll down to see each section. Drag images onto the placeholder boxes.",
    scene: scene.toJSON(),
  };
}

function buildBeforeAfter(prompt) {
  const scene = generateHotelSheet("before-after");
  return {
    message:
      "Here's your before & after comparison! Shows:\n" +
      "• Side-by-side daily operations (5 areas)\n" +
      "• Revenue impact stats (+22% upsell, -62% staff costs, +31% reviews)\n" +
      "• Image placeholders for before/after lobby photos\n\n" +
      "The jokes are in light grey — read them while recording if you want.",
    scene: scene.toJSON(),
  };
}

function buildTimeSavings(prompt) {
  const scene = new Scene();

  scene.add(titleSlide({
    title: "Time Savings Breakdown",
    subtitle: "Every minute counts at the front desk",
  }));

  const y1 = slideY(1);
  scene.add(...sectionHeader({ title: "Minutes Per Guest Interaction", y: y1 }));
  scene.add(...comparisonBars({
    title: "Traditional vs AI-Powered",
    beforeLabel: "Traditional",
    afterLabel: "AI-Powered",
    data: [
      { label: "Check-in", before: 8, after: 2.2 },
      { label: "Check-out", before: 5, after: 0.5 },
      { label: "Room info", before: 3, after: 0.3 },
      { label: "Concierge", before: 6, after: 1.5 },
      { label: "Complaint", before: 10, after: 4 },
    ],
    x: 80,
    y: y1 + 70,
    unit: " min",
  }));

  scene.add(...imagePlaceholder({
    x: 900,
    y: y1 + 100,
    width: 380,
    height: 260,
    label: "📷 Frustrated guest in queue vs happy guest with phone",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("timeSaving"), type: "joke" },
      { text: "8 minutes might not sound like much — until you multiply by 100 guests a day", type: "talking-point" },
    ],
    x: 80,
    y: y1 + 530,
  }));

  const y2 = slideY(2);
  scene.add(...sectionHeader({ title: "Annual Time Saved", y: y2 }));
  scene.add(...statRow({
    y: y2 + 70,
    stats: [
      { value: "1,460 hrs", label: "Check-in Time Saved", sublabel: "Per year, 100 rooms", color: PALETTE.teal },
      { value: "730 hrs", label: "Check-out Time Saved", sublabel: "Per year, 100 rooms", color: PALETTE.blue },
      { value: "€38K", label: "Labour Cost Saved", sublabel: "At €17.50/hr average", color: PALETTE.purple },
    ],
    cardWidth: 320,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "1,460 hours — that's like having an extra employee working full time, just on check-ins", type: "talking-point" },
      { text: randomJoke("costs"), type: "joke" },
    ],
    x: 60,
    y: y2 + 300,
  }));

  return {
    message:
      "Here's your time savings breakdown! Shows:\n" +
      "• Side-by-side comparison of time per task (check-in, check-out, etc.)\n" +
      "• Annual hours saved and cost equivalent\n\n" +
      "The numbers are based on a 100-room property. Edit them to match your case.",
    scene: scene.toJSON(),
  };
}

function buildFeatureComparison(prompt) {
  const scene = new Scene();

  scene.add(titleSlide({
    title: "What Changes With AI",
    subtitle: "Feature-by-feature breakdown",
  }));

  const y1 = slideY(1);
  scene.add(...featureGrid({
    title: "Capability Comparison",
    columns: ["Traditional", "AI-Powered"],
    features: [
      { name: "24/7 Check-in Available", values: [false, true] },
      { name: "No Queue Wait Time", values: [false, true] },
      { name: "50+ Language Support", values: [false, true] },
      { name: "Auto ID Verification", values: [false, true] },
      { name: "Digital Room Key", values: [false, true] },
      { name: "Smart Room Assignment", values: [false, true] },
      { name: "Instant Billing/Receipt", values: [false, true] },
      { name: "Automated Upselling", values: [false, true] },
      { name: "Guest Preference Memory", values: [false, true] },
      { name: "Human Touch When Needed", values: [true, true] },
    ],
    x: 60,
    y: y1 + 20,
    width: 700,
  }));

  scene.add(...imagePlaceholder({
    x: 850,
    y: y1 + 50,
    width: 400,
    height: 300,
    label: "📷 Modern hotel kiosk or app screenshot",
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "Notice the last row — AI doesn't replace humans, it frees them up", type: "talking-point" },
      { text: randomJoke("general"), type: "joke" },
    ],
    x: 850,
    y: y1 + 390,
  }));

  return {
    message:
      "Here's your feature comparison grid!\n" +
      "• 10 capabilities compared side-by-side\n" +
      "• Note: 'Human Touch' is ✓ for both — great talking point\n\n" +
      "Edit features or add more rows directly in Excalidraw.",
    scene: scene.toJSON(),
  };
}

function buildRevenueImpact(prompt) {
  const scene = new Scene();

  scene.add(titleSlide({
    title: "Revenue Impact of AI Front Desk",
    subtitle: "It's not just about saving — it's about earning more",
  }));

  const y1 = slideY(1);
  scene.add(...sectionHeader({ title: "Revenue Gains", y: y1 }));
  scene.add(...statRow({
    y: y1 + 70,
    stats: [
      { value: "+22%", label: "Upsell Revenue", sublabel: "AI-powered room upgrades at check-in", color: PALETTE.teal },
      { value: "+15%", label: "Ancillary Revenue", sublabel: "Spa, restaurant, tour bookings via AI", color: PALETTE.blue },
      { value: "+31%", label: "Positive Reviews", sublabel: "Faster service = happier guests", color: PALETTE.amber },
    ],
    cardWidth: 320,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "The upsell number catches everyone off guard — AI is better at suggesting upgrades because it has the data", type: "talking-point" },
      { text: randomJoke("costs"), type: "joke" },
    ],
    x: 60,
    y: y1 + 310,
  }));

  const y2 = slideY(2);
  scene.add(...sectionHeader({ title: "Cost Reductions", y: y2 }));
  scene.add(...barChart({
    title: "Monthly Savings by Category",
    data: [
      { label: "Night staff", value: 4200, color: PALETTE.teal },
      { label: "Training", value: 1300, color: PALETTE.blue },
      { label: "Error costs", value: 650, color: PALETTE.purple },
      { label: "Overtime", value: 1800, color: PALETTE.amber },
      { label: "Admin", value: 900, color: PALETTE.coral },
    ],
    x: 80,
    y: y2 + 60,
    unit: "€",
  }));

  scene.add(...statRow({
    y: y2 + 500,
    stats: [
      { value: "€8,850", label: "Total Monthly Savings", color: PALETTE.teal },
      { value: "€106K", label: "Annual Savings", color: PALETTE.blue },
    ],
    cardWidth: 350,
    gap: 40,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "106K a year — for most mid-size hotels, that's a game changer", type: "talking-point" },
      { text: randomJoke("costs"), type: "joke" },
    ],
    x: 60,
    y: y2 + 700,
  }));

  return {
    message:
      "Here's your revenue impact analysis! Shows:\n" +
      "• Revenue gains: upsells (+22%), ancillary (+15%), reviews (+31%)\n" +
      "• Cost savings by category (€8,850/month)\n" +
      "• Total annual impact: €106K\n\n" +
      "Edit the numbers to match your specific hotel case.",
    scene: scene.toJSON(),
  };
}

function buildCustomChart(prompt) {
  const scene = new Scene();
  const numbers = extractNumbers(prompt);

  scene.add(...sectionHeader({ title: "Hotel Front Desk Metrics", y: 30 }));
  scene.add(...barChart({
    title: "Key Performance Indicators",
    data: [
      { label: "Check-in", value: numbers[0] || 8, color: PALETTE.blue },
      { label: "Check-out", value: numbers[1] || 5, color: PALETTE.teal },
      { label: "Inquiries", value: numbers[2] || 12, color: PALETTE.amber },
      { label: "Complaints", value: numbers[3] || 3, color: PALETTE.coral },
    ],
    x: 80,
    y: 100,
  }));

  scene.add(...scriptBlock({
    lines: [{ text: randomJoke("general"), type: "joke" }],
    x: 80,
    y: 550,
  }));

  return {
    message: "Here's your chart! I used the numbers from your prompt where I found them, and filled in typical hotel metrics for the rest. Edit directly on the canvas.",
    scene: scene.toJSON(),
  };
}

function buildCustomStats(prompt) {
  const scene = new Scene();

  scene.add(...sectionHeader({ title: "Hotel AI Dashboard", y: 30 }));
  scene.add(...statRow({
    y: 100,
    stats: [
      { value: "73%", label: "Time Saved at Check-in", color: PALETTE.teal },
      { value: "€47K", label: "Annual Cost Savings", color: PALETTE.blue },
      { value: "4.6★", label: "Guest Satisfaction", color: PALETTE.amber },
      { value: "24/7", label: "Availability", color: PALETTE.purple },
    ],
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "These are real averages from hotels that have switched — not projections", type: "talking-point" },
      { text: randomJoke("general"), type: "joke" },
    ],
    x: 60,
    y: 310,
  }));

  return {
    message: "Here's your KPI dashboard! Four key stats with clean cards. Edit any numbers directly.",
    scene: scene.toJSON(),
  };
}

function buildCustomTimeline(prompt) {
  const scene = new Scene();

  scene.add(...sectionHeader({ title: "AI Front Desk Process", y: 30 }));
  scene.add(...timeline({
    steps: [
      { label: "Guest books", detail: "Online/phone", color: PALETTE.blue },
      { label: "Pre-check-in", detail: "AI sends link", color: PALETTE.teal },
      { label: "ID verified", detail: "Automated scan", color: PALETTE.purple },
      { label: "Arrive & tap", detail: "Kiosk or phone", color: PALETTE.teal },
      { label: "Room ready", detail: "Digital key sent", color: PALETTE.blue },
      { label: "AI concierge", detail: "24/7 support", color: PALETTE.amber },
    ],
    x: 40,
    y: 80,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: "Six steps — and the guest barely had to do anything", type: "talking-point" },
      { text: randomJoke("guestExperience"), type: "joke" },
    ],
    x: 60,
    y: 300,
  }));

  return {
    message: "Here's your process flow! Shows the AI-powered guest journey in 6 steps. Add or edit steps directly.",
    scene: scene.toJSON(),
  };
}

function buildCustomComparison(prompt) {
  const scene = new Scene();

  scene.add(...comparison({
    title: "Traditional vs AI Front Desk",
    leftTitle: "❌  Traditional",
    rightTitle: "✅  AI-Powered",
    items: [
      { left: "Manual check-in (8 min)", right: "Self-service (2 min)" },
      { left: "Night receptionist needed", right: "AI handles everything" },
      { left: "2-3 languages", right: "50+ languages instant" },
      { left: "Paper forms", right: "Digital, pre-filled" },
      { left: "Phone for every request", right: "AI chatbot 24/7" },
    ],
    x: 60,
    y: 30,
    width: 1000,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("checkin"), type: "joke" },
    ],
    x: 60,
    y: 480,
  }));

  return {
    message: "Here's your comparison table! 5 areas side-by-side. Edit any text directly on the canvas.",
    scene: scene.toJSON(),
  };
}

function buildSmartDefault(prompt) {
  // For prompts we can't specifically categorize, build a mixed sheet
  const scene = new Scene();

  scene.add(titleSlide({
    title: "AI Hotel Front Desk",
    subtitle: prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt,
  }));

  const y1 = slideY(1);
  scene.add(...sectionHeader({ title: "The Key Numbers", y: y1 }));
  scene.add(...statRow({
    y: y1 + 70,
    stats: [
      { value: "73%", label: "Time Saved", color: PALETTE.teal },
      { value: "€47K", label: "Annual Savings", color: PALETTE.blue },
      { value: "24/7", label: "Available", color: PALETTE.purple },
    ],
    cardWidth: 320,
  }));

  scene.add(...scriptBlock({
    lines: [
      { text: randomJoke("general"), type: "joke" },
    ],
    x: 60,
    y: y1 + 280,
  }));

  const y2 = slideY(2);
  scene.add(...comparison({
    title: "The Difference",
    leftTitle: "❌  Without AI",
    rightTitle: "✅  With AI",
    items: [
      { left: "Manual check-in (8 min)", right: "Automated (2 min)" },
      { left: "Night shift staff needed", right: "AI handles nights" },
      { left: "Language barriers", right: "50+ languages" },
    ],
    x: 60,
    y: y2,
  }));

  scene.add(...imagePlaceholder({
    x: 1100,
    y: y2 + 50,
    width: 350,
    height: 250,
    label: "📷 Add a relevant image here",
  }));

  return {
    message:
      "I generated a general hotel AI front desk sheet with stats and a comparison. " +
      "You can be more specific — try asking for:\n" +
      "• ROI analysis\n" +
      "• Guest journey flow\n" +
      "• Time savings chart\n" +
      "• Feature comparison grid\n" +
      "• Revenue impact\n" +
      "• Before vs after",
    scene: scene.toJSON(),
  };
}
