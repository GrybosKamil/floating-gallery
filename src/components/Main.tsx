import { useEffect, useState } from "react";
import { RandomMoveGalleryScene } from "../scenes/random-move-gallery/RandomMoveGalleryScene";
import { RoomWallsGalleryScene } from "../scenes/room-walls-gallery/RoomWallsGalleryScene";
import { SurroundingCircleGalleryScene } from "../scenes/surrounding-circle-gallery/SurroundingCircleGalleryScene";
// import { FullRoomGalleryScene } from "../scenes/full-room-gallery/FullRoomGalleryScene";

const SCENES = [
  // "full-room",
  "room-walls",
  "circle",
  "random",
] as const;
type SceneType = (typeof SCENES)[number];

export function Main() {
  function getInitialScene(saveScene: boolean): SceneType {
    if (saveScene) {
      const saved = localStorage.getItem("galleryScene");
      if (saved && SCENES.includes(saved as SceneType))
        return saved as SceneType;
    }
    return SCENES[Math.floor(Math.random() * SCENES.length)];
  }

  const [saveScene, setSaveScene] = useState(() => {
    return localStorage.getItem("gallerySaveScene") === "true";
  });

  const [scene, setScene] = useState<SceneType>(() =>
    getInitialScene(saveScene)
  );
  const [panelMinimized, setPanelMinimized] = useState(false);

  useEffect(() => {
    if (saveScene) {
      localStorage.setItem("galleryScene", scene);
    }
    localStorage.setItem("gallerySaveScene", saveScene ? "true" : "false");
  }, [scene, saveScene]);

  let SceneComponent;
  switch (scene) {
    // case "full-room":
    //   SceneComponent = FullRoomGalleryScene;
    //   break;
    case "room-walls":
      SceneComponent = RoomWallsGalleryScene;
      break;
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
          minWidth: panelMinimized ? 32 : 260,
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
          <>
            <label style={{ marginRight: 12 }}>
              Choose Gallery Scene:{" "}
              <select
                value={scene}
                onChange={(e) => setScene(e.target.value as SceneType)}
              >
                {/* <option value="full-room">Full Room</option> */}
                <option value="room-walls">Room Walls</option>
                <option value="circle">Surrounding Circle</option>
                <option value="random">Random Move</option>
              </select>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="checkbox"
                checked={saveScene}
                onChange={(e) => setSaveScene(e.target.checked)}
                style={{ marginRight: 4 }}
              />
              Save selection
            </label>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SceneComponent />
      </div>
    </div>
  );
}
