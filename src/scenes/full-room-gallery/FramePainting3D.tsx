import React, { useState } from "react";
import * as THREE from "three";
import { Painting } from "../../types/painting.types";
import { Frame3D } from "./Frame3D";
import { Painting3D } from "./Painting3D";

interface FramePainting3DProps {
  painting: Painting;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  onClick?: (painting: Painting) => void;
}

const PROPORTIONS = 0.01;

export const FramePainting3D: React.FC<FramePainting3DProps> = ({
  painting,
  position,
  rotation,
  onClick = () => {},
}) => {
  const ratio = painting.dimensions.width / painting.dimensions.height;

  const [dimensions] = useState({
    width: ratio * painting.dimensions.width * PROPORTIONS,
    height: painting.dimensions.height * PROPORTIONS,
  });

  const paintingOffset = 0.5
  const frameOffset = 0.2

  return (
    <group position={position} rotation={rotation}>
      <Frame3D width={dimensions.width} height={dimensions.height} position={new THREE.Vector3(0,0,frameOffset)}/>
      <Painting3D
        painting={painting}
        position={new THREE.Vector3(0, 0, paintingOffset)}
        rotation={new THREE.Euler(0, 0, 0)}
        onClick={onClick}
      />
    </group>
  );
};
