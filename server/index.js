// Express API server for the Hotel Excalidraw Visualizer
// Receives prompts, generates Excalidraw scene JSON, returns it
// SSE push channel lets Claude Code push scenes to the browser

import express from "express";
import cors from "cors";
import { interpretPrompt } from "./interpreter.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ── SSE: connected browser clients ───────────────────────────────────────

const sseClients = new Set();

app.get("/api/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("data: {\"type\":\"connected\"}\n\n");
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

function pushToClients(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

// ── Generate from chat UI ────────────────────────────────────────────────

app.post("/api/generate", (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const result = interpretPrompt(prompt);
    res.json(result);
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({
      error: err.message,
      message: "Something went wrong generating the visualization.",
    });
  }
});

// ── Push from Claude Code (or any external tool) ─────────────────────────

app.post("/api/push", (req, res) => {
  try {
    const { prompt, scene } = req.body;

    if (scene) {
      // Direct scene JSON push
      pushToClients({ type: "scene", scene, message: "Pushed from Claude Code" });
      res.json({ ok: true, message: "Scene pushed to browser" });
    } else if (prompt) {
      // Generate from prompt, then push
      const result = interpretPrompt(prompt);
      pushToClients({ type: "scene", scene: result.scene, message: result.message });
      res.json({ ok: true, message: result.message });
    } else {
      res.status(400).json({ error: "Provide 'prompt' or 'scene'" });
    }
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ─────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", clients: sseClients.size });
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`\n  🏨 Hotel Visualizer API running on http://localhost:${PORT}`);
  console.log(`  📡 SSE push endpoint: POST http://localhost:${PORT}/api/push`);
  console.log(`  💡 Push from Claude Code: curl -X POST http://localhost:${PORT}/api/push -H "Content-Type: application/json" -d '{"prompt":"your prompt"}'\n`);
});
