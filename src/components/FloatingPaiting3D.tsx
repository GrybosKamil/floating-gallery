import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Painting } from "./Painting";

const SPACE_LIMITS = {
  x: { min: -5, max: 5 },
  y: { min: -5, max: 5 },
  z: { min: -5, max: 5 },
};

export type FloatingPainting3DProps = {
  painting: Painting;
  initialPosition?: THREE.Vector3;
  initialRotation?: THREE.Euler;
  initialVelocity?: THREE.Vector3;
};

export function FloatingPaiting3D({
  painting,
  initialPosition,
  initialRotation,
  initialVelocity,
}: FloatingPainting3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, painting.url);

  const [dimensions] = useState({
    width: painting.dimensions.width / painting.dimensions.height,
    height: 1,
  });

  const rotationDirection = generateRotationDirection();

  let velocity = initialVelocity ? initialVelocity : generateInitialVelocity();

  const position = initialPosition
    ? initialPosition
    : generateInitialPosition();

  const rotation = initialRotation
    ? initialRotation
    : generateInitialRotation();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationDirection.x;
      meshRef.current.rotation.y += rotationDirection.y;
      meshRef.current.rotation.z += rotationDirection.z;

      meshRef.current.position.add(velocity);

      if (
        meshRef.current.position.x > SPACE_LIMITS.x.max ||
        meshRef.current.position.x < SPACE_LIMITS.x.min
      ) {
        velocity = new THREE.Vector3(-velocity.x, velocity.y, velocity.z);
      }
      if (
        meshRef.current.position.y > SPACE_LIMITS.y.max ||
        meshRef.current.position.y < SPACE_LIMITS.y.min
      ) {
        velocity = new THREE.Vector3(velocity.x, -velocity.y, velocity.z);
      }
      if (
        meshRef.current.position.z > SPACE_LIMITS.z.max ||
        meshRef.current.position.z < SPACE_LIMITS.z.min
      ) {
        velocity = new THREE.Vector3(velocity.x, velocity.y, -velocity.z);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={painting.title}
      position={position}
      rotation={rotation}
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

function getRandomNumberInDefaultRange() {
  return getRandomNumberInRange(-3, 3);
}

function getRandomNumberInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateRotationDirection() {
  return new THREE.Euler(
    getRandomNumberInRange(-0.005, 0.005),
    getRandomNumberInRange(-0.005, 0.005),
    getRandomNumberInRange(-0.005, 0.005),
  );
}

function generateInitialRotation() {
  return new THREE.Euler(
    getRandomNumberInRange(0, Math.PI * 2),
    getRandomNumberInRange(0, Math.PI * 2),
    getRandomNumberInRange(0, Math.PI * 2),
  );
}

function generateInitialPosition() {
  return new THREE.Vector3(
    getRandomNumberInDefaultRange(),
    getRandomNumberInDefaultRange(),
    getRandomNumberInDefaultRange(),
  );
}

function generateInitialVelocity() {
  return new THREE.Vector3(
    getRandomNumberInRange(-0.01, 0.01),
    getRandomNumberInRange(-0.01, 0.01),
    getRandomNumberInRange(-0.01, 0.01),
  );
}
