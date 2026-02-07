# Excalidraw Hotel Visualizer

A chat-based tool that generates hotel AI front desk visualizations directly inside an Excalidraw canvas. Type what you want, see it instantly — no files to manage, no copy-pasting.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — you'll see a chat panel on the left and the Excalidraw canvas on the right.

Type something like:
- "Show me ROI analysis for a 50-room hotel"
- "Guest journey comparison: traditional vs AI check-in"
- "Before and after AI front desk"
- "Time savings chart"
- "Feature comparison grid"
- "Revenue impact of AI front desk"

Or click one of the quick-start buttons.

The visualization appears instantly on the canvas. Script lines (light grey jokes and talking points) are included for your recording.

## How it works

```
You type a prompt  →  Server interprets it  →  Generates Excalidraw JSON  →  Canvas updates
     (chat)            (keyword matching)        (element templates)         (auto zoom-to-fit)
```

- **Frontend**: React + Excalidraw component (Vite dev server, port 5173)
- **Backend**: Express API (port 3200, proxied through Vite)
- **No external AI API needed** — prompt interpretation is built-in keyword matching with smart defaults

## What's on the canvas

- **Stat cards** — big numbers with labels (time saved, cost savings, etc.)
- **Bar charts** — vertical bars with value labels
- **Comparison charts** — side-by-side before/after bars
- **Timelines** — horizontal process flows with numbered steps
- **Comparison tables** — two-column side-by-side layout
- **Feature grids** — check/cross capability tables
- **Title slides** — dark hero backgrounds with centered text
- **Image placeholders** — dashed boxes you can drag real photos onto
- **Script lines** — light grey text with jokes and talking points

Everything is editable directly in Excalidraw after generation.

## CLI mode (generate .excalidraw files)

If you prefer file-based output:

```bash
# Generate all preset templates
node src/cli.js --template all

# Generate a specific template
node src/cli.js --template roi
node src/cli.js --template journey
node src/cli.js --template before-after
```

Open the output `.excalidraw` files at [excalidraw.com](https://excalidraw.com).

## Project structure

```
├── web/                  # Frontend (React + Excalidraw)
│   ├── App.jsx           # Split-panel layout
│   ├── ChatPanel.jsx     # Chat interface with quick prompts
│   └── main.jsx          # Entry point
├── server/               # Backend API
│   ├── index.js          # Express server
│   └── interpreter.js    # Prompt → visualization mapper
├── src/
│   ├── core/             # Excalidraw element primitives
│   │   ├── elements.js   # rectangle, text, arrow, line, ellipse, image
│   │   ├── scene.js      # Scene builder with image embedding
│   │   ├── colors.js     # Modern color palette
│   │   └── layout.js     # Grid, row, column helpers
│   ├── templates/        # Visualization components
│   │   ├── barChart.js   # Bar charts + comparison bars
│   │   ├── statCard.js   # KPI stat cards
│   │   ├── timeline.js   # Process flows
│   │   ├── comparison.js # Side-by-side + feature grid
│   │   ├── titleSlide.js # Hero titles + section headers
│   │   ├── scriptLine.js # Light grey script/joke lines
│   │   └── imagePanel.js # Image panels + placeholders
│   ├── presets/          # Ready-to-use hotel sheets
│   │   └── hotelSheets.js
│   ├── index.js          # Public API
│   └── cli.js            # CLI interface
└── examples/
    └── custom-sheet.js   # Programmatic API example
```

## Script lines & jokes

Light grey text appears on the canvas with talking points and jokes. Categories:
- `checkin` — check-in process humor
- `costs` — cost/budget jokes
- `timeSaving` — time efficiency quips
- `guestExperience` — guest satisfaction humor
- `general` — hotel industry observations

These are visible enough to read while recording but subtle enough not to distract viewers.
