#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import readline from "readline";

const client = new Anthropic();

// ---------------------------------------------------------------------------
// System prompt – instructs Claude to emit ONLY valid Excalidraw JSON
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an expert at creating professional B2B data visualizations using Excalidraw.

Your ONLY task is to generate a complete, valid Excalidraw JSON file based on the user's description.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL OUTPUT RULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Output ONLY the raw JSON object – absolutely no markdown code fences, no
explanations, no introductory text, no trailing text. The very first character
of your response must be '{' and the very last must be '}'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLOR PALETTE (use consistently)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Blue stroke:      #1971c2   ← borders for headers, key boxes
Primary Green stroke:     #2f9e44   ← positive metrics, savings, gains
Light Blue fill:          #d0ebff   ← header / title box backgrounds
Light Green fill:         #d3f9d8   ← positive value box backgrounds
White fill:               #ffffff   ← regular content boxes
Dark text:                #1e1e1e   ← all body text
Gray border:              #868e96   ← secondary / de-emphasised borders
Light gray fill:          #f8f9fa   ← alternating row backgrounds
Red stroke:               #e03131   ← costs, negatives, warnings
Light red fill:           #ffe3e3   ← negative value box backgrounds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Organize content left-to-right OR top-to-bottom with clear hierarchy
- Padding between sibling elements: 40–60 px
- Canvas size: roughly 1200–1800 px wide × 800–1400 px tall
- Title / header: fontSize 24–28, centred at top of canvas
- Section labels: fontSize 20–22, bold-style (use ALL CAPS or colon suffix)
- Body text / data: fontSize 16–18
- Small labels / notes: fontSize 14
- Group related elements with a light background rectangle underneath them
- Align columns and rows on a consistent grid

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ELEMENT FIELD RULES (every element must have ALL these fields)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common fields for rectangle / ellipse / diamond / line:
  id            – unique string like "el_1", "el_2", …
  type          – "rectangle" | "ellipse" | "diamond" | "arrow" | "text"
  x, y          – top-left position in pixels
  width, height – dimensions in pixels
  angle         – 0
  strokeColor   – hex color string
  backgroundColor – hex color string
  fillStyle     – "solid" | "hachure" | "cross-hatch" | "none"
  strokeWidth   – 2 for primary, 1 for secondary
  strokeStyle   – "solid"
  roughness     – 0  (clean look)
  opacity       – 100
  groupIds      – []
  frameId       – null
  seed          – random integer 1–99999
  version       – 1
  versionNonce  – random integer 1–999999
  isDeleted     – false
  boundElements – []
  updated       – 1
  link          – null
  locked        – false

Additional fields for "text" elements:
  text          – the string content (use \\n for line breaks)
  fontSize      – integer (14–28)
  fontFamily    – 1
  textAlign     – "center" | "left" | "right"
  verticalAlign – "middle" | "top"
  containerId   – null
  lineHeight    – 1.25

Additional fields for "arrow" elements:
  points        – array of [x,y] pairs, e.g. [[0,0],[120,0]]
  startBinding  – null
  endBinding    – null
  elbowed       – false
  lastCommittedPoint – null

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUALIZATION TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Choose the best type for the prompt and generate rich, realistic data:

ROI Table        – Grid with header row (blue), data rows, totals row (green).
                   Include specific dollar figures and percentages.

Process Flow     – Left-to-right sequence of labelled rectangles joined by
                   arrows. Include decision diamonds where appropriate.

Comparison Chart – Side-by-side columns (2–4 options) comparing features,
                   costs, or metrics with tick/cross or colour coding.

Cost-Benefit     – T-chart or waterfall layout with costs (red) vs gains
Breakdown          (green) and a net result row.

KPI Dashboard    – Grid of metric cards each showing a number, label, and
                   trend indicator. Use colour coding for good/bad/neutral.

Always include real-looking numbers, timeframes, and business context that
make the visualisation immediately useful and credible for a B2B audience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED TOP-LEVEL STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [ /* all your elements here */ ],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}`;

// ---------------------------------------------------------------------------
// Core generation function
// ---------------------------------------------------------------------------
async function generateExcalidraw(prompt, outputPath = "output.excalidraw") {
  console.log(`\nGenerating: "${prompt}"`);
  process.stdout.write("Calling Claude");

  const stream = client.messages.stream({
    model: "claude-sonnet-4-0",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content:
          `Create a professional B2B Excalidraw visualization for:\n\n${prompt}\n\n` +
          `Remember: output ONLY the raw JSON — first char '{', last char '}'.`,
      },
    ],
  });

  // Dot progress indicator
  let dots = 0;
  stream.on("text", () => {
    dots++;
    if (dots % 80 === 0) process.stdout.write(".");
  });

  const finalMessage = await stream.finalMessage();
  console.log(" done.\n");

  const rawText = finalMessage.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // Robustly extract JSON even if Claude adds a code fence despite the prompt
  let jsonText = rawText;
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1];
  } else if (!rawText.startsWith("{")) {
    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      jsonText = rawText.slice(start, end + 1);
    }
  }

  // Parse & validate
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(
      `Claude returned invalid JSON: ${err.message}\n` +
        `First 500 chars of response:\n${rawText.slice(0, 500)}`
    );
  }

  if (parsed.type !== "excalidraw") {
    throw new Error(
      'Response is not a valid Excalidraw file (type field must be "excalidraw")'
    );
  }
  if (!Array.isArray(parsed.elements)) {
    throw new Error("Response is missing the elements array");
  }

  // Ensure required appState fields are present
  parsed.appState = {
    gridSize: null,
    viewBackgroundColor: "#ffffff",
    ...(parsed.appState || {}),
  };
  parsed.files = parsed.files || {};

  fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), "utf8");

  const types = [...new Set(parsed.elements.map((e) => e.type))].join(", ");
  console.log(`Saved  → ${path.resolve(outputPath)}`);
  console.log(`       ${parsed.elements.length} elements (${types})`);
  return outputPath;
}

// ---------------------------------------------------------------------------
// Watch mode – interactive readline loop
// ---------------------------------------------------------------------------
async function watchMode(initialPrompt) {
  if (initialPrompt) {
    try {
      await generateExcalidraw(initialPrompt);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    '\nexcalidraw-gen watch mode  (type a prompt and press Enter; "exit" to quit)\n'
  );

  const loop = () => {
    rl.question("Prompt> ", async (input) => {
      const prompt = input.trim();

      if (!prompt) {
        loop();
        return;
      }

      if (prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      try {
        await generateExcalidraw(prompt);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }

      loop();
    });
  };

  loop();
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
  console.error("  export ANTHROPIC_API_KEY=your_api_key_here");
  process.exit(1);
}

const args = process.argv.slice(2);
const watch = args.includes("--watch") || args.includes("-w");
const prompt = args
  .filter((a) => a !== "--watch" && a !== "-w")
  .join(" ")
  .trim();

if (!watch && !prompt) {
  console.error(
    [
      "Usage:",
      "  node index.js <prompt>          Generate a single diagram",
      "  node index.js --watch           Interactive mode (multiple prompts)",
      "  node index.js --watch <prompt>  Interactive mode with an initial prompt",
      "",
      "Examples:",
      '  node index.js "ROI calculator for hotel front desk automation"',
      '  node index.js "3-step SaaS onboarding process flow"',
      "  node index.js --watch",
    ].join("\n")
  );
  process.exit(1);
}

if (watch) {
  watchMode(prompt || null);
} else {
  generateExcalidraw(prompt, "output.excalidraw").catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
