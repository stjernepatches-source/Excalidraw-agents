import React, { useState, useRef, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ChatPanel from "./ChatPanel.jsx";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [chatCollapsed, setChatCollapsed] = useState(false);

  const handleSceneGenerated = useCallback(
    (sceneData) => {
      if (!excalidrawAPI) return;

      // Update the Excalidraw canvas with the generated scene
      excalidrawAPI.updateScene({
        elements: sceneData.elements,
      });

      // Add files if present (images)
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

      // Zoom to fit the content
      setTimeout(() => {
        excalidrawAPI.scrollToContent(excalidrawAPI.getSceneElements(), {
          fitToContent: true,
          viewportZoomFactor: 0.9,
        });
      }, 100);
    },
    [excalidrawAPI]
  );

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
            onSceneGenerated={handleSceneGenerated}
            onCollapse={() => setChatCollapsed(true)}
          />
        )}
      </div>

      {/* Excalidraw canvas */}
      <div style={styles.canvasSide}>
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
};
