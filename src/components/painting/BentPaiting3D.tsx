import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Painting } from "../../types/painting.types";

export function BentPainting3D({
  painting,
  radius = 1,
  angle = Math.PI / 6,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Euler(0, 0, 0),
  onClick,
}: {
  painting: Painting;
  radius: number;
  angle: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  onClick: (painting: Painting) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, painting.url);

  return (
    <mesh
      ref={meshRef}
      name={painting.title}
      position={position}
      rotation={rotation}
      onClick={() => onClick(painting)}
    >
      <cylinderGeometry
        args={[
          radius,
          radius,
          painting.dimensions.height,
          32,
          1,
          true,
          -angle / 2,
          angle,
        ]}
      />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}
