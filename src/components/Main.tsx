import { useState } from "react";
import { SurroundingCircleGalleryScene } from "../scenes/surrounding-circle-gallery/SurroundingCircleGalleryScene";
import { RandomMoveGalleryScene } from "../scenes/random-move-gallery/RandomMoveGalleryScene";

export function Main() {
  const [scene, setScene] = useState("circle");
  const [panelMinimized, setPanelMinimized] = useState(false);

  let SceneComponent;
  switch (scene) {
    case "random":
      SceneComponent = RandomMoveGalleryScene;
      break;
    case "circle":
    default:
      SceneComponent = SurroundingCircleGalleryScene;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: panelMinimized ? 6 : 12,
          zIndex: 10,
          minWidth: panelMinimized ? 32 : 220,
          minHeight: 32,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPanelMinimized((m) => !m)}
          style={{
            marginRight: panelMinimized ? 0 : 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
            width: 24,
            height: 24,
            borderRadius: 4,
          }}
          aria-label={panelMinimized ? "Expand panel" : "Minimize panel"}
          title={panelMinimized ? "Expand panel" : "Minimize panel"}
        >
          {panelMinimized ? "➕" : "➖"}
        </button>
        {!panelMinimized && (
          <label>
            Choose Gallery Scene:{" "}
            <select value={scene} onChange={e => setScene(e.target.value)}>
              <option value="circle">Surrounding Circle</option>
              <option value="random">Random Move</option>
            </select>
          </label>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SceneComponent />
      </div>
    </div>
  );
}