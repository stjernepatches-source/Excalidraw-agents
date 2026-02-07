# Excalidraw Hotel Visualizer

Generate presentation-ready `.excalidraw` files for YouTube videos about AI-automated hotel front desk systems.

## What it does

- Generates clean, modern Excalidraw visualizations with hotel industry data
- Creates bar charts, stat cards, timelines, comparison tables, and feature grids
- Adds **light grey script lines** (jokes & talking points) as subtle presenter notes
- Includes **image placeholders** where you drag & drop relevant photos
- Outputs valid `.excalidraw` files you open directly at [excalidraw.com](https://excalidraw.com)

## Quick start

```bash
# Generate all preset templates
node src/cli.js --template all

# Generate a specific template
node src/cli.js --template roi
node src/cli.js --template journey
node src/cli.js --template before-after

# Custom output directory
node src/cli.js --template all --output ./my-slides

# List available templates
node src/cli.js --list
```

Then open any `.excalidraw` file at [excalidraw.com](https://excalidraw.com) (File → Open).

## Preset templates

| Template | Description |
|---|---|
| `roi` | ROI & cost savings — key metrics, cost breakdown charts, time savings |
| `journey` | Guest journey — traditional vs AI check-in flow, feature comparison grid |
| `before-after` | Before/After — side-by-side daily operations, revenue impact stats |

## Build custom sheets

Use the API to create your own visualizations:

```javascript
import { Scene, titleSlide, statRow, barChart, scriptBlock, PALETTE, slideY } from "./src/index.js";

const scene = new Scene();

// Title slide
scene.add(titleSlide({ title: "Your Video Title", subtitle: "Your subtitle" }));

// Stats section
scene.add(...statRow({
  y: slideY(1) + 70,
  stats: [
    { value: "85%", label: "Time Saved", color: PALETTE.teal },
    { value: "€50K", label: "Annual Savings", color: PALETTE.blue },
  ],
}));

// Add a joke line (light grey, subtle)
scene.add(...scriptBlock({
  lines: [{ text: "Your joke or talking point here", type: "joke" }],
  x: 60, y: slideY(1) + 300,
}));

// Save
import { writeFile } from "fs/promises";
await writeFile("my-sheet.excalidraw", scene.toString());
```

See `examples/custom-sheet.js` for a full working example.

## Available components

| Component | Import | Purpose |
|---|---|---|
| `titleSlide` | `templates/titleSlide` | Hero title with dark background |
| `sectionHeader` | `templates/titleSlide` | Section divider with accent line |
| `statCard` / `statRow` | `templates/statCard` | Big number KPI cards |
| `barChart` | `templates/barChart` | Vertical bar charts |
| `comparisonBars` | `templates/barChart` | Side-by-side bar comparison |
| `timeline` | `templates/timeline` | Horizontal process flow |
| `verticalTimeline` | `templates/timeline` | Vertical step-by-step |
| `comparison` | `templates/comparison` | Two-column comparison |
| `featureGrid` | `templates/comparison` | Check/cross feature table |
| `scriptLine` / `scriptBlock` | `templates/scriptLine` | Light grey presenter notes |
| `imagePlaceholder` | `templates/imagePanel` | Dashed box for dropping images |
| `imagePanel` | `templates/imagePanel` | Embedded image with caption |

## How to use in your workflow

1. **Generate** a preset or custom sheet
2. **Open** the `.excalidraw` file at excalidraw.com
3. **Replace** image placeholders by dragging photos onto them
4. **Edit** any numbers or text directly — it's all editable
5. **Read** the light grey script lines while recording (or ignore them)
6. **Present** by scrolling through the canvas during your video

## Adding real images

To embed images directly in the file (instead of placeholders):

```javascript
import { Scene, image, imagePanel } from "./src/index.js";

const scene = new Scene();
const fileId = await scene.addImageFile("./photos/hotel-lobby.jpg");
scene.add(...imagePanel({ fileId, x: 100, y: 100, caption: "Our lobby" }));
```

## Script lines & jokes

The light grey text lines are pre-written talking points and jokes. They show up very subtly in Excalidraw — visible enough to read while recording, but not distracting in the presentation.

Categories: `checkin`, `costs`, `timeSaving`, `guestExperience`, `general`

```javascript
import { randomJoke, scriptBlock } from "./src/index.js";

scene.add(...scriptBlock({
  lines: [
    { text: randomJoke("costs"), type: "joke" },
    { text: "Transition to the next topic...", type: "transition" },
  ],
  x: 60, y: 500,
}));
```
