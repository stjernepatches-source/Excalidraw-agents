import React, { useState, useRef, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ChatPanel from "./ChatPanel.jsx";

export default function App() {
  const excalidrawAPIRef = useRef(null);
  const [apiReady, setApiReady] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [pushMessage, setPushMessage] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(null);
  const pendingScene = useRef(null);

  // Check if the server has a Claude API key configured
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHasApiKey(d.llm === "claude"))
      .catch(() => setHasApiKey(false));
  }, []);

  const loadScene = useCallback(
    (sceneData) => {
      const api = excalidrawAPIRef.current;
      if (!api) {
        // Queue it — will load when API becomes ready
        pendingScene.current = sceneData;
        return;
      }

      try {
        api.updateScene({
          elements: sceneData.elements,
        });

        if (sceneData.files && Object.keys(sceneData.files).length > 0) {
          api.addFiles(
            Object.values(sceneData.files).map((f) => ({
              id: f.id,
              dataURL: f.dataURL,
              mimeType: f.mimeType,
              created: f.created,
              lastRetrieved: f.lastRetrieved,
            }))
          );
        }

        setTimeout(() => {
          try {
            api.scrollToContent(api.getSceneElements(), {
              fitToContent: true,
              viewportZoomFactor: 0.9,
            });
          } catch (e) {
            console.warn("scrollToContent failed:", e);
          }
        }, 200);
      } catch (err) {
        console.error("loadScene error:", err);
      }
    },
    []
  );

  // When the API becomes ready, load any pending scene
  useEffect(() => {
    if (apiReady && pendingScene.current) {
      loadScene(pendingScene.current);
      pendingScene.current = null;
    }
  }, [apiReady, loadScene]);

  const downloadScene = useCallback(() => {
    const api = excalidrawAPIRef.current;
    if (!api) return;
    const elements = api.getSceneElements();
    const appState = api.getAppState();
    const files = api.getFiles();
    const scene = {
      type: "excalidraw",
      version: 2,
      source: "excalidraw-ai-generator",
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor || "#ffffff",
        currentItemFontFamily: appState.currentItemFontFamily,
      },
      files,
    };
    const blob = new Blob([JSON.stringify(scene, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visualization.excalidraw";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // SSE: listen for scenes pushed from Claude Code
  useEffect(() => {
    const evtSource = new EventSource("/api/events");
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "scene" && data.scene) {
          loadScene(data.scene);
          setPushMessage(data.message || "Updated from Claude Code");
          setTimeout(() => setPushMessage(null), 4000);
        }
      } catch (e) {
        console.warn("SSE parse error:", e);
      }
    };
    evtSource.onerror = () => {
      console.warn("SSE connection error — will auto-retry");
    };
    return () => evtSource.close();
  }, [loadScene]);

  return (
    <div style={styles.container}>
      {/* Chat panel */}
      <div
        style={{
          ...styles.chatSide,
          width: chatCollapsed ? 48 : 380,
          minWidth: chatCollapsed ? 48 : 380,
        }}
      >
        {chatCollapsed ? (
          <button
            style={styles.expandBtn}
            onClick={() => setChatCollapsed(false)}
            title="Open chat"
          >
            💬
          </button>
        ) : (
          <ChatPanel
            onSceneGenerated={loadScene}
            onCollapse={() => setChatCollapsed(true)}
          />
        )}
      </div>

      {/* Excalidraw canvas */}
      <div style={styles.canvasSide}>
        {/* API key warning */}
        {hasApiKey === false && (
          <div style={styles.apiWarning}>
            No API key detected — running in keyword-fallback mode.{" "}
            <strong>Add ANTHROPIC_API_KEY to your .env file</strong> and restart the server for full AI generation.
          </div>
        )}

        {/* Download button */}
        <button style={styles.downloadBtn} onClick={downloadScene} title="Download as .excalidraw file (import into excalidraw.com)">
          ↓ Download .excalidraw
        </button>

        {pushMessage && (
          <div style={styles.toast}>{pushMessage}</div>
        )}
        <Excalidraw
          excalidrawAPI={(api) => {
            excalidrawAPIRef.current = api;
            setApiReady(true);
          }}
          theme="light"
          initialData={{
            appState: {
              viewBackgroundColor: "#ffffff",
              currentItemFontFamily: 2,
            },
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  chatSide: {
    height: "100%",
    borderRight: "1px solid #e5e7eb",
    transition: "width 0.2s ease",
    overflow: "hidden",
    flexShrink: 0,
  },
  canvasSide: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  expandBtn: {
    width: 48,
    height: 48,
    border: "none",
    background: "#f8f9fa",
    cursor: "pointer",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #e5e7eb",
  },
  toast: {
    position: "absolute",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1B2A4A",
    color: "white",
    padding: "8px 20px",
    borderRadius: 8,
    fontSize: 13,
    zIndex: 1000,
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },
  apiWarning: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "#fff3cd",
    color: "#856404",
    padding: "8px 16px",
    fontSize: 12,
    zIndex: 100,
    borderBottom: "1px solid #ffc107",
    textAlign: "center",
  },
  downloadBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 100,
    background: "#1B2A4A",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
  },
};
