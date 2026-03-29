# excalidraw-gen

A CLI tool that turns a text prompt into a ready-to-import `.excalidraw` file using the Claude API.

## Prerequisites

- **Node.js 18+**
- An **Anthropic API key** – get one at [console.anthropic.com](https://console.anthropic.com/)

## Setup

```bash
# 1. Navigate to this directory
cd excalidraw-gen

# 2. Install dependencies
npm install

# 3. Export your API key
export ANTHROPIC_API_KEY=sk-ant-...
```

> **Tip:** Add the export line to your `~/.bashrc` or `~/.zshrc` to avoid repeating it.

## Usage

### Single prompt

```bash
node index.js "ROI calculator for hotel front desk automation showing cost savings"
```

Generates `output.excalidraw` in the current directory.

### Watch mode (multiple prompts in sequence)

```bash
node index.js --watch
```

Keeps the tool running so you can type prompt after prompt without restarting:

```
excalidraw-gen watch mode  (type a prompt and press Enter; "exit" to quit)

Prompt> 3-step SaaS onboarding process flow
Generating: "3-step SaaS onboarding process flow"
Calling Claude............ done.
Saved  → /your/path/output.excalidraw
       18 elements (rectangle, text, arrow)

Prompt> comparison chart: in-house vs outsourced customer support
...
Prompt> exit
Goodbye!
```

### Watch mode with an initial prompt

```bash
node index.js --watch "ROI calculator for hotel front desk automation"
```

Processes the prompt first, then drops into interactive mode.

### npm scripts

```bash
npm start -- "your prompt here"   # same as node index.js "..."
npm run watch                      # alias for node index.js --watch
```

## Output

Every run writes `output.excalidraw` to the **current working directory**
(re-running overwrites it, so rename the file if you want to keep it).

Import the file into [excalidraw.com](https://excalidraw.com) via:
**File → Open** or drag-and-drop onto the canvas.

## Diagram types generated

The system prompt steers Claude to produce clean B2B visuals:

| Prompt style | Output layout |
|---|---|
| "ROI calculator for …" | Table grid with header, data rows, totals |
| "process flow for …" | Left-to-right boxes connected by arrows |
| "comparison of X vs Y" | Side-by-side columns with colour-coded cells |
| "cost-benefit breakdown of …" | T-chart with red cost rows and green gain rows |
| "KPI dashboard for …" | Grid of metric cards with numbers and labels |

## Color palette

| Role | Hex |
|---|---|
| Primary blue (borders, headers) | `#1971c2` |
| Primary green (gains, savings) | `#2f9e44` |
| Light blue fill | `#d0ebff` |
| Light green fill | `#d3f9d8` |
| Red (costs, negatives) | `#e03131` |
| Light red fill | `#ffe3e3` |
| Body text | `#1e1e1e` |

## Troubleshooting

| Problem | Fix |
|---|---|
| `Error: ANTHROPIC_API_KEY environment variable is not set` | Run `export ANTHROPIC_API_KEY=sk-ant-...` |
| `Error: Claude returned invalid JSON` | Try rephrasing your prompt; very complex prompts occasionally produce malformed output |
| Elements look cramped | Add "with plenty of whitespace" to your prompt |
| Need a specific layout | Mention it explicitly, e.g. "top-to-bottom flow" or "side-by-side comparison" |

## Model

Uses **Claude Sonnet 4** (`claude-sonnet-4-0`) with streaming and up to 8 192 output tokens — plenty of headroom for diagrams with 30–60 elements.
