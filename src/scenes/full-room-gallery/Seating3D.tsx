import React from "react";
// import { useFrame } from '@react-three/fiber';
import * as THREE from "three";

interface Seating3DProps {
  position: THREE.Vector3;
}

export const Seating3D: React.FC<Seating3DProps> = ({ position }) => {
  const ref = React.useRef<THREE.Mesh>(null);

  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.rotation.y += 0.01; // Optional: Add some rotation for effect
  //   }
  // });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 0.5, 0.5]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};
