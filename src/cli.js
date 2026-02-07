#!/usr/bin/env node

// CLI for generating hotel front desk AI visualization Excalidraw files
// Usage: node src/cli.js [--template <name>] [--output <dir>] [--list]

import { writeFile, mkdir } from "fs/promises";
import { join, resolve } from "path";
import { generateHotelSheet, PRESETS } from "./presets/hotelSheets.js";

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

function hasFlag(flag) {
  return args.includes(flag);
}

// ── Help ──────────────────────────────────────────────────────────────────

if (hasFlag("--help") || hasFlag("-h")) {
  console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║          Excalidraw Hotel Visualizer                        ║
  ║          Generate presentation-ready .excalidraw files      ║
  ╚══════════════════════════════════════════════════════════════╝

  Usage:
    node src/cli.js [options]

  Options:
    --template <name>   Template to generate (default: "all")
    --output <dir>      Output directory (default: "./output")
    --list              List available templates
    --help, -h          Show this help

  Templates:
    roi            ROI & cost savings analysis
    journey        Guest journey flow comparison
    before-after   Before/after AI comparison
    all            Generate all templates

  Examples:
    node src/cli.js --template roi --output ./my-slides
    node src/cli.js --template all
    node src/cli.js --list
`);
  process.exit(0);
}

// ── List templates ────────────────────────────────────────────────────────

if (hasFlag("--list")) {
  console.log("\nAvailable templates:\n");
  for (const [key, { desc }] of Object.entries(PRESETS)) {
    console.log(`  ${key.padEnd(15)} ${desc}`);
  }
  console.log(`  ${"all".padEnd(15)} Generate all templates`);
  console.log();
  process.exit(0);
}

// ── Generate ──────────────────────────────────────────────────────────────

const template = getArg("--template") || "all";
const outputDir = resolve(getArg("--output") || "./output");

async function main() {
  await mkdir(outputDir, { recursive: true });

  console.log(`\n🏨 Excalidraw Hotel Visualizer\n`);

  if (template === "all") {
    const sheets = generateHotelSheet("all");
    for (const { name, description, scene } of sheets) {
      const filePath = join(outputDir, `hotel-${name}.excalidraw`);
      await writeFile(filePath, scene.toString());
      console.log(`  ✅ ${name.padEnd(15)} → ${filePath}`);
      console.log(`     ${description}\n`);
    }
  } else {
    const scene = generateHotelSheet(template);
    const filePath = join(outputDir, `hotel-${template}.excalidraw`);
    await writeFile(filePath, scene.toString());
    console.log(`  ✅ ${template.padEnd(15)} → ${filePath}`);
  }

  console.log(`\n📂 Output: ${outputDir}`);
  console.log(`📌 Open any .excalidraw file at https://excalidraw.com\n`);
  console.log(`💡 Tips:`);
  console.log(`   - Drag & drop images onto the 📷 placeholder areas`);
  console.log(`   - Light grey text = your script lines (jokes & talking points)`);
  console.log(`   - Edit numbers/text directly in Excalidraw to customize\n`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
