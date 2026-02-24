Generate a complete, valid Excalidraw JSON file based on this description: $ARGUMENTS

Follow these rules exactly:

---

## OUTPUT RULE
Write ONLY the raw JSON object to the file — no markdown, no explanation, no code fences. The JSON must start with `{` and end with `}`.

---

## COLOR PALETTE
- Primary Blue stroke: `#1971c2` — borders for headers, key boxes
- Primary Green stroke: `#2f9e44` — positive metrics, savings, gains
- Light Blue fill: `#d0ebff` — header/title box backgrounds
- Light Green fill: `#d3f9d8` — positive value box backgrounds
- White fill: `#ffffff` — regular content boxes
- Dark text: `#1e1e1e` — all body text
- Gray border: `#868e96` — secondary/de-emphasised borders
- Light gray fill: `#f8f9fa` — alternating row backgrounds
- Red stroke: `#e03131` — costs, negatives, warnings
- Light red fill: `#ffe3e3` — negative value box backgrounds

---

## LAYOUT RULES
- Organize content left-to-right OR top-to-bottom with clear hierarchy
- Padding between sibling elements: 40–60 px
- Canvas size: roughly 1200–1800 px wide × 800–1400 px tall
- Title/header: fontSize 24–28, centred at top of canvas
- Section labels: fontSize 20–22 (ALL CAPS or colon suffix)
- Body text/data: fontSize 16–18
- Small labels/notes: fontSize 14
- Group related elements with a light background rectangle underneath them
- Align columns and rows on a consistent grid

---

## ELEMENT FIELDS (every element must have ALL of these)

Common fields for rectangle / ellipse / diamond / line / arrow:
- `id` — unique string like "el_1", "el_2", …
- `type` — "rectangle" | "ellipse" | "diamond" | "arrow" | "text"
- `x`, `y` — top-left position in pixels
- `width`, `height` — dimensions in pixels
- `angle` — 0
- `strokeColor` — hex color string
- `backgroundColor` — hex color string
- `fillStyle` — "solid" | "hachure" | "cross-hatch" | "none"
- `strokeWidth` — 2 for primary, 1 for secondary
- `strokeStyle` — "solid"
- `roughness` — 0
- `opacity` — 100
- `groupIds` — []
- `frameId` — null
- `seed` — random integer 1–99999
- `version` — 1
- `versionNonce` — random integer 1–999999
- `isDeleted` — false
- `boundElements` — []
- `updated` — 1
- `link` — null
- `locked` — false

Additional fields for "text" elements:
- `text` — string content (use \n for line breaks)
- `fontSize` — integer (14–28)
- `fontFamily` — 1
- `textAlign` — "center" | "left" | "right"
- `verticalAlign` — "middle" | "top"
- `containerId` — null
- `lineHeight` — 1.25

Additional fields for "arrow" elements:
- `points` — array of [x,y] pairs, e.g. [[0,0],[120,0]]
- `startBinding` — null
- `endBinding` — null
- `elbowed` — false
- `lastCommittedPoint` — null

---

## VISUALIZATION TYPES

Choose the best type for the prompt and generate rich, realistic data:

- **ROI Table** — Grid with header row (blue), data rows, totals row (green). Include specific dollar figures and percentages.
- **Process Flow** — Left-to-right sequence of labelled rectangles joined by arrows. Include decision diamonds where appropriate.
- **Comparison Chart** — Side-by-side columns (2–4 options) comparing features, costs, or metrics with colour coding.
- **Cost-Benefit Breakdown** — T-chart or waterfall with costs (red) vs gains (green) and a net result row.
- **KPI Dashboard** — Grid of metric cards each showing a number, label, and trend indicator.

Always include real-looking numbers, timeframes, and business context that make the visualisation immediately useful for a B2B audience.

---

## REQUIRED TOP-LEVEL STRUCTURE

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

---

## FINAL STEP

Use the Write tool to save the result to `output.excalidraw` in the current working directory. The file contents must be the raw JSON only — nothing else.
