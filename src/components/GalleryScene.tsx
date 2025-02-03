import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { FloatingPaiting3D } from "./FloatingPaiting3D";
import { PAITINGS } from "./Paintings";

const LIGHT_MODE_BACKGROUND_COLOR = "#fafafa";
const DARK_MODE_BACKGROUND_COLOR = "#2a2b2e";

export function GalleryScene() {
  const controlPosition = new THREE.Vector3(0, 0, 0);

  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const backgroundColor = prefersDarkMode
    ? DARK_MODE_BACKGROUND_COLOR
    : LIGHT_MODE_BACKGROUND_COLOR;

  return (
    <Canvas style={{ background: backgroundColor }}>
      <ambientLight intensity={0.5} />
      <OrbitControls position={controlPosition} />

      {PAITINGS.map((painting) => (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          key={painting.id + "-error"}
        >
          <FloatingPaiting3D key={painting.id} painting={painting} />
        </ErrorBoundary>
      ))}
    </Canvas>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  console.log({ error });
  return <></>;
}
