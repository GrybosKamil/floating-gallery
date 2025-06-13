import React from "react";
import * as THREE from "three";

interface Frame3DProps {
  width: number;
  height: number;
  position: THREE.Vector3;
}

export const Frame3D: React.FC<Frame3DProps> = ({
  width,
  height,
  position,
}) => {
  const frameRef = React.useRef<THREE.Mesh>(null);

  const frameGeometry = new THREE.BoxGeometry(width + 0.1, height + 0.1, 0.05);
  const frameMaterial = new THREE.MeshStandardMaterial({ color: "#d1b000" });

  return (
    <mesh
      ref={frameRef}
      geometry={frameGeometry}
      material={frameMaterial}
      position={position}
    >
      <meshStandardMaterial attach="material" color="#d1b000" />
    </mesh>
  );
};
