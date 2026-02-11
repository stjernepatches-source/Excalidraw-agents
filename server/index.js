// Express API server for the Hotel Excalidraw Visualizer
// Claude API interprets prompts → spec renderer builds Excalidraw scenes → SSE pushes to browser

import "dotenv/config";
import express from "express";
import cors from "cors";
import { interpretWithClaude } from "./claudeInterpreter.js";
import { renderSpec } from "./specRenderer.js";
import { interpretPrompt } from "./interpreter.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const HAS_API_KEY = !!process.env.ANTHROPIC_API_KEY;

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

// ── Generate: Claude API (smart) or fallback (keyword) ───────────────────

async function generate(prompt) {
  if (HAS_API_KEY) {
    console.log("  🧠 Sending to Claude API...");
    const spec = await interpretWithClaude(prompt);
    const scene = renderSpec(spec);
    return {
      message: "Generated with Claude AI — edit anything directly on the canvas.",
      scene: scene.toJSON(),
    };
  } else {
    console.log("  ⚡ Using keyword fallback (no API key)");
    return interpretPrompt(prompt);
  }
}

// ── API endpoints ────────────────────────────────────────────────────────

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const result = await generate(prompt);
    res.json(result);
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({
      error: err.message,
      message: "Something went wrong. Check the server console for details.",
    });
  }
});

app.post("/api/push", async (req, res) => {
  try {
    const { prompt, scene } = req.body;

    if (scene) {
      pushToClients({ type: "scene", scene, message: "Pushed from Claude Code" });
      res.json({ ok: true, message: "Scene pushed to browser" });
    } else if (prompt) {
      const result = await generate(prompt);
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", clients: sseClients.size, llm: HAS_API_KEY ? "claude" : "fallback" });
});

// ── Start ────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`\n  🏨 Hotel Visualizer API on http://localhost:${PORT}`);
  console.log(`  🧠 LLM: ${HAS_API_KEY ? "Claude API ✅" : "⚠️  No ANTHROPIC_API_KEY — using keyword fallback"}`);
  if (!HAS_API_KEY) {
    console.log(`  💡 Add your key: echo "ANTHROPIC_API_KEY=sk-ant-..." > .env`);
  }
  console.log();
});
