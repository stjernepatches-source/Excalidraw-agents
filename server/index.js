// Express API server for the Hotel Excalidraw Visualizer
// Receives prompts, generates Excalidraw scene JSON, returns it

import express from "express";
import cors from "cors";
import { interpretPrompt } from "./interpreter.js";

const app = express();
app.use(cors());
app.use(express.json());

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`\n  🏨 Hotel Visualizer API running on http://localhost:${PORT}`);
});
