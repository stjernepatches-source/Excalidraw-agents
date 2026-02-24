Generate an Excalidraw visualization and push it live to the open browser canvas.

## Usage
`/excalidraw-gen <prompt>`

Example: `/excalidraw-gen ROI analysis for a 50-room hotel`

## What to do

1. First check the server is running:
   ```bash
   curl -s http://localhost:3200/api/health
   ```
   If it returns an error or connection refused, tell the user to run `npm run dev` first and stop here.

2. Push the visualization using the prompt provided:
   ```bash
   node push.js "$ARGUMENTS"
   ```

3. Report back what was generated. If the push succeeded, tell the user the canvas has been updated and they can edit the visualization directly in the browser at http://localhost:5173.

4. If the push fails with a server error, show the error message and suggest the user check the terminal running `npm run dev` for details.

## Notes
- `$ARGUMENTS` is the full prompt text the user typed after `/excalidraw-gen`
- The server uses the Claude API if `ANTHROPIC_API_KEY` is set in `.env`, otherwise falls back to keyword matching
- Supported prompt types: ROI analysis, guest journey, before/after comparison, time savings, feature comparison, revenue impact, bar charts, stat cards, timelines
