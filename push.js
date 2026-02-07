#!/usr/bin/env node

// Push a visualization to the running browser tab.
// Usage: node push.js "Show me ROI analysis for a hotel"
// Called by Claude Code to send visualizations hands-free.

const prompt = process.argv.slice(2).join(" ");

if (!prompt) {
  console.error("Usage: node push.js <prompt>");
  console.error('Example: node push.js "ROI analysis for 50-room hotel"');
  process.exit(1);
}

const PORT = process.env.PORT || 3200;

try {
  const res = await fetch(`http://localhost:${PORT}/api/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`Server error: ${res.status}`, err.error || "");
    process.exit(1);
  }

  const data = await res.json();
  console.log("Pushed to browser:", data.message?.split("\n")[0] || "Done");
} catch (err) {
  if (err.cause?.code === "ECONNREFUSED") {
    console.error("Server not running. Start it first: npm run dev");
  } else {
    console.error("Error:", err.message);
  }
  process.exit(1);
}
