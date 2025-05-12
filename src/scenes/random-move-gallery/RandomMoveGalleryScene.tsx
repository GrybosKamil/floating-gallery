import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { Painting } from "../../types/painting.types";
import { PaintingModal } from "../../components/painting/PaintingModal";
import { PAINTINGS } from "../../components/painting/Paintings";
import { FloatingPainting3D } from "../../components/painting/FloatingPainting3D";

const LIGHT_MODE_BACKGROUND_COLOR = "#fafafa";
const DARK_MODE_BACKGROUND_COLOR = "#2a2b2e";

export function RandomeMoveGalleryScene() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const controlPosition = new THREE.Vector3(0, 0, 0);

  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const backgroundColor = prefersDarkMode
    ? DARK_MODE_BACKGROUND_COLOR
    : LIGHT_MODE_BACKGROUND_COLOR;

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleCloseModal = () => {
    setSelectedPainting(null);
  };

  return (
    <>
      <Canvas style={{ background: backgroundColor }}>
        <ambientLight intensity={0.5} />
        <OrbitControls position0={controlPosition} />

        {PAINTINGS.map((painting) => (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            key={painting.url + "-error"}
          >
            <FloatingPainting3D
              key={painting.url}
              painting={painting}
              onClick={() => handlePaintingClick(painting)}
            />
          </ErrorBoundary>
        ))}
      </Canvas>
      {selectedPainting && (
        <PaintingModal painting={selectedPainting} onClose={handleCloseModal} />
      )}
    </>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  console.log({ error });
  return <></>;
}
