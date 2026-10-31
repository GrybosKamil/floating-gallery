import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as THREE from "three";
import { FramePainting3D } from "./FramePainting3D";
import { Lighting } from "./Lighting";
import { Seating3D } from "./Seating3D";
import { PAINTINGS } from "../../data/Paintings";
import { Painting } from "../../types/painting.types";

import { PaintingModal } from "../../components/painting/PaintingModal";

const WALL_COUNT = 8;
const WALL_HEIGHT = 3;
const WALL_WIDTH = 4;
const WALL_APOTHEM = WALL_WIDTH / 2 / Math.tan(Math.PI / WALL_COUNT);

const getWallPosition = (index: number) => {
  const angle = (index * 2 * Math.PI) / WALL_COUNT;
  return new THREE.Vector3(
    WALL_APOTHEM * Math.cos(angle),
    WALL_HEIGHT / 2,
    WALL_APOTHEM * Math.sin(angle)
  );
};

const getWallRotation = (index: number) => {
  const baseAngle = (index * 2 * Math.PI) / WALL_COUNT + Math.PI / 2;
  const extra = index % 2 === 1 ? Math.PI / 2 : 0;
  return new THREE.Euler(0, baseAngle + extra, 0);
};

function Wall({
  position,
  rotation,
}: {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[WALL_WIDTH, WALL_HEIGHT]} />
      <meshStandardMaterial color="#eaeaea" side={THREE.DoubleSide} />
    </mesh>
  );
}

function Floor() {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load("textures/wood_table_worn_diff_1k.jpg");
  }, []);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[WALL_APOTHEM + 1, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export function FullRoomGalleryScene() {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );

  const paintings = useMemo(() => {
    const shuffled = [...PAINTINGS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, WALL_COUNT);
  }, []);

  const handlePaintingClick = (painting: Painting) => {
    setSelectedPainting(painting);
  };

  const handleCloseModal = () => {
    setSelectedPainting(null);
  };

  return (
    <>
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={50} position={[0, 1.2, 2]} />
        <Lighting />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.7} castShadow />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          target={[0, 1.2, 0]}
          maxDistance={WALL_APOTHEM - 0.5}
        />

        <Floor />

        {Array.from({ length: WALL_COUNT }).map((_, i) => (
          <Wall
            key={i}
            position={getWallPosition(i)}
            rotation={getWallRotation(i)}
          />
        ))}

        {paintings.map((painting, i) => {
          const wallPos = getWallPosition(i);
          const wallRot = getWallRotation(i);
          const paintingPos = wallPos
            .clone()
            .add(new THREE.Vector3(0.0, 0.0, 0.2 * Math.sign(wallPos.z)));

          console.log({ painting, i, paintingPos, wallPos, wallRot });

          return (
            <ErrorBoundary
              key={painting.url + "-error"}
              FallbackComponent={ErrorFallback}
            >
              <FramePainting3D
                painting={painting}
                position={paintingPos}
                rotation={wallRot}
                onClick={() => handlePaintingClick(painting)}
              />
            </ErrorBoundary>
          );
        })}

        <Seating3D position={new THREE.Vector3(0, 0, 0)} />
      </Canvas>
      {selectedPainting && (
        <PaintingModal painting={selectedPainting} onClose={handleCloseModal} />
      )}
    </>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  console.log("error in FullRoomGalleryScene:");
  console.log({ error });
  return <></>;
}
