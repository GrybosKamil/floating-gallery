import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
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

const PAINTINGS_MARGIN = 0.5;
const WIDTH_SCALE = 1.5;

const ITEMS_PER_ROW = 7;
const ROW_MARGIN = 2;

function splitIntoRows<T>(array: T[], itemsPerRow: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < array.length; i += itemsPerRow) {
    rows.push(array.slice(i, i + itemsPerRow));
  }
  return rows;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function RoomWallsGalleryScene() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const backgroundColor = prefersDarkMode
    ? DARK_MODE_BACKGROUND_COLOR
    : LIGHT_MODE_BACKGROUND_COLOR;

  const randomizedPaintings = useMemo(() => shuffleArray(PAINTINGS), []);

  const rows = useMemo(
    () => splitIntoRows(randomizedPaintings, ITEMS_PER_ROW),
    [randomizedPaintings]
  );

  const wallPositions = useMemo(() => {
    const positions: { position: THREE.Vector3; rotation: THREE.Euler }[] = [];
    const totalRows = rows.length;
    const centerRowIdx = Math.floor(totalRows / 2);

    const rowHeights = rows.map((row) =>
      Math.max(...row.map((p) => (p.dimensions.height ?? 1) * WIDTH_SCALE), 1)
    );

    const yPositions: number[] = [];
    let y = 0;

    yPositions[centerRowIdx] = 0;

    for (let i = centerRowIdx - 1; i >= 0; i--) {
      y += (rowHeights[i + 1] + rowHeights[i]) / 2 + ROW_MARGIN;
      yPositions[i] = y;
    }

    y = 0;
    for (let i = centerRowIdx + 1; i < totalRows; i++) {
      y -= (rowHeights[i - 1] + rowHeights[i]) / 2 + ROW_MARGIN;
      yPositions[i] = y;
    }

    rows.forEach((row, rowIdx) => {
      const widths = row.map((p) => (p.dimensions.width ?? 1) * WIDTH_SCALE);
      const totalWidth =
        widths.reduce((sum, width) => sum + width, 0) +
        PAINTINGS_MARGIN * (row.length - 1);

      let currentX = -totalWidth / 2;

      row.forEach((_, idx) => {
        const width = widths[idx];
        const x = currentX + width / 2;
        currentX += width + PAINTINGS_MARGIN;
        positions.push({
          position: new THREE.Vector3(x, yPositions[rowIdx], -5),
          rotation: new THREE.Euler(0, 0, 0),
        });
      });
    });
    return positions;
  }, [rows]);

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleCloseModal = () => {
    setSelectedPainting(null);
  };

  const galleryDepth = -5;
  const galleryWidth = useMemo(() => {
    return Math.max(
      ...rows.map(
        (row) =>
          row.reduce(
            (sum, p) => sum + (p.dimensions.width ?? 1) * WIDTH_SCALE,
            0
          ) +
          PAINTINGS_MARGIN * (row.length - 1)
      ),
      1
    );
  }, [rows]);

  const galleryHeight = useMemo(() => {
    return (
      rows.reduce(
        (sum, row) =>
          sum +
          Math.max(
            ...row.map((p) => (p.dimensions.height ?? 1) * WIDTH_SCALE),
            1
          ),
        0
      ) +
      ROW_MARGIN * (rows.length - 1)
    );
  }, [rows]);

  const cameraZ = useMemo(() => {
    const fov = 50; // default
    const aspect = window.innerWidth / window.innerHeight;
    const maxDim = Math.max(galleryWidth / aspect, galleryHeight);
    return (
      Math.abs(galleryDepth) +
      maxDim / (2 * Math.tan((fov * Math.PI) / 360)) +
      2
    );
  }, [galleryWidth, galleryHeight, galleryDepth]);

  const canvaScene = useMemo(() => {
    const controlPosition = new THREE.Vector3(0, 0, 0);

    return (
      <Canvas style={{ background: backgroundColor }}>
        <PerspectiveCamera makeDefault fov={50} position={[0, 0, cameraZ]} />
        <ambientLight intensity={0.5} />
        <OrbitControls
          target={[0, 0, galleryDepth]}
          position0={controlPosition}
        />

        {randomizedPaintings.map((painting, idx) => (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            key={painting.url + "-error"}
          >
            <Painting3D
              key={painting.url}
              painting={painting}
              position={wallPositions[idx].position}
              rotation={wallPositions[idx].rotation}
              onClick={() => handlePaintingClick(painting)}
            />
          </ErrorBoundary>
        ))}
      </Canvas>
    );
  }, [
    backgroundColor,
    cameraZ,
    galleryDepth,
    randomizedPaintings,
    wallPositions,
  ]);

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
