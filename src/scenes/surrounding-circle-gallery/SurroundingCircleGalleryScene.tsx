import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { Painting3D } from "../../components/painting/Painting3D";
import { PaintingModal } from "../../components/painting/PaintingModal";
import { PAINTINGS } from "../../data/Paintings";
import { Painting } from "../../types/painting.types";

const LIGHT_MODE_BACKGROUND_COLOR = "#fafafa";
const DARK_MODE_BACKGROUND_COLOR = "#2a2b2e";

const PAINTINGS_MARGIN = 0.5; // Set a reasonable margin between paintings
const WIDTH_SCALE = 1.5; // Scale down widths for layout

export function SurroundingCircleGalleryScene() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const backgroundColor = prefersDarkMode
    ? DARK_MODE_BACKGROUND_COLOR
    : LIGHT_MODE_BACKGROUND_COLOR;

  const scaledWidths = PAINTINGS.map(
    (p) => (p.dimensions.width ?? 1) * WIDTH_SCALE
  );
  const totalArc = scaledWidths.reduce(
    (sum, width) => sum + width + PAINTINGS_MARGIN,
    0
  );
  const radius = totalArc / (2 * Math.PI);

  const circlePositions = useMemo(
    () => getCirclePositions(PAINTINGS, radius, WIDTH_SCALE, PAINTINGS_MARGIN),
    [radius]
  );

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleCloseModal = () => {
    setSelectedPainting(null);
  };

  const canvaScene = useMemo(() => {
    const controlPosition = new THREE.Vector3(0, 0, 0);

    return (
      <Canvas style={{ background: backgroundColor }}>
        <ambientLight intensity={0.5} />
        <OrbitControls position0={controlPosition} />

        {PAINTINGS.map((painting, idx) => (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            key={painting.url + "-error"}
          >
            <Painting3D
              key={painting.url}
              painting={painting}
              position={circlePositions[idx].position}
              rotation={circlePositions[idx].rotation}
              onClick={() => handlePaintingClick(painting)}
            />
          </ErrorBoundary>
        ))}
      </Canvas>
    );
  }, [backgroundColor, circlePositions]);

  return (
    <>
      {canvaScene}
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

function getCirclePositions(
  paintings: Painting[],
  radius: number,
  widthScale = 1,
  margin = 0
) {
  const widths = paintings.map((p) => (p.dimensions.width ?? 1) * widthScale);

  const totalArc = widths.reduce((sum, width) => sum + width + margin, 0);
  const anglePerUnit = (2 * Math.PI) / totalArc;

  let currentAngle = 0;
  return paintings.map((_, i) => {
    const width = widths[i];
    const angle = currentAngle + (width / 2) * anglePerUnit;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    currentAngle += (width + margin) * anglePerUnit;
    return {
      position: new THREE.Vector3(x, 0, z),
      rotation: new THREE.Euler(0, angle, 0),
    };
  });
}
