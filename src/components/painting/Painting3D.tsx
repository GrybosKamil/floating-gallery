import { useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Painting } from "../../types/painting.types";

export function Painting3D({
  painting,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Euler(0, 0, 0),
  onClick = () => {},
}: {
  painting: Painting;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  onClick: (painting: Painting) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, painting.url);

  const [dimensions] = useState({
    width: painting.dimensions.width / painting.dimensions.height,
    height: 1,
  });

  return (
    <mesh
      ref={meshRef}
      name={painting.title}
      position={position}
      rotation={rotation}
      onClick={() => onClick(painting)}
    >
      <boxGeometry args={[dimensions.width, dimensions.height, 0.1]} />
      <meshBasicMaterial attach="material-0" color="black" />
      <meshBasicMaterial attach="material-1" color="black" />
      <meshBasicMaterial attach="material-2" color="black" />
      <meshBasicMaterial attach="material-3" color="black" />
      <meshBasicMaterial attach="material-4" map={texture} />
      <meshBasicMaterial attach="material-5" map={texture} />
    </mesh>
  );
}
