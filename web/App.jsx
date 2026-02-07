import React, { useState, useRef, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ChatPanel from "./ChatPanel.jsx";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [pushMessage, setPushMessage] = useState(null);

  const loadScene = useCallback(
    (sceneData) => {
      if (!excalidrawAPI) return;

      excalidrawAPI.updateScene({
        elements: sceneData.elements,
      });

      if (sceneData.files && Object.keys(sceneData.files).length > 0) {
        excalidrawAPI.addFiles(
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
        excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements(), {
          fitToContent: true,
          viewportZoomFactor: 0.9,
        });
      }, 100);
    },
    [excalidrawAPI]
  );

  // SSE: listen for scenes pushed from Claude Code
  useEffect(() => {
    if (!excalidrawAPI) return;

    const evtSource = new EventSource("/api/events");
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "scene" && data.scene) {
          loadScene(data.scene);
          setPushMessage(data.message || "Updated from Claude Code");
          setTimeout(() => setPushMessage(null), 4000);
        }
      } catch {}
    };
    return () => evtSource.close();
  }, [excalidrawAPI, loadScene]);

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
        {pushMessage && (
          <div style={styles.toast}>{pushMessage}</div>
        )}
        <Excalidraw
          ref={(api) => {
            if (api && !excalidrawAPI) setExcalidrawAPI(api);
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
    animation: "fadeIn 0.3s ease",
  },
};
