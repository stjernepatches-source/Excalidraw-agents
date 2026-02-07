import React, { useState, useRef, useEffect } from "react";

const QUICK_PROMPTS = [
  { label: "ROI & Cost Savings", prompt: "Show me an ROI analysis with cost savings for a 50-room hotel switching to AI front desk" },
  { label: "Guest Journey", prompt: "Create a guest journey comparison: traditional check-in vs AI-powered check-in flow" },
  { label: "Before vs After", prompt: "Build a before and after comparison of daily hotel operations with and without AI" },
  { label: "Time Savings Chart", prompt: "Bar chart showing time per guest interaction: check-in, check-out, room info — traditional vs AI" },
  { label: "Feature Comparison", prompt: "Feature comparison grid: what traditional front desk has vs what AI front desk offers" },
  { label: "Revenue Impact", prompt: "Show revenue impact stats: upsell increase, cost reduction, review improvement from AI front desk" },
];

export default function ChatPanel({ onSceneGenerated, onCollapse }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! Describe what you want to visualize about hotel AI front desk systems, and I'll generate it on the canvas.\n\nOr pick a quick start below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.message || "Here's your visualization!" },
      ]);

      if (data.scene) {
        onSceneGenerated(data.scene);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${err.message}. Is the server running?` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Hotel Visualizer</div>
          <div style={styles.subtitle}>Excalidraw AI Sheets</div>
        </div>
        <button style={styles.collapseBtn} onClick={onCollapse} title="Collapse">
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.userMsg : styles.assistantMsg),
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, ...styles.assistantMsg }}>
            <span style={styles.dots}>Generating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div style={styles.quickPrompts}>
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              style={styles.quickBtn}
              onClick={() => sendMessage(qp.prompt)}
              disabled={loading}
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          style={styles.input}
          placeholder="Describe your visualization..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          →
        </button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#fafafa",
  },
  header: {
    padding: "16px 16px 12px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "#1B2A4A",
    color: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 2,
  },
  collapseBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: 20,
    cursor: "pointer",
    padding: "0 4px",
    opacity: 0.7,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  message: {
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 13,
    lineHeight: 1.5,
    maxWidth: "92%",
    whiteSpace: "pre-wrap",
  },
  userMsg: {
    background: "#228BE6",
    color: "white",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantMsg: {
    background: "white",
    color: "#1e1e1e",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    border: "1px solid #e5e7eb",
  },
  dots: {
    opacity: 0.6,
    fontStyle: "italic",
  },
  quickPrompts: {
    padding: "8px 12px",
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    borderTop: "1px solid #e5e7eb",
  },
  quickBtn: {
    padding: "6px 12px",
    fontSize: 12,
    border: "1px solid #d0d5dd",
    borderRadius: 20,
    background: "white",
    cursor: "pointer",
    color: "#495057",
    transition: "all 0.15s",
  },
  inputArea: {
    padding: "12px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 8,
    background: "white",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #d0d5dd",
    borderRadius: 10,
    fontSize: 13,
    resize: "none",
    fontFamily: "inherit",
    outline: "none",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "none",
    background: "#228BE6",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    alignSelf: "flex-end",
  },
};
