import React from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';

export default function Sky() {

    const [skymat, setSkyMat] = useState(SkyMaterial());

  return (
    <mesh scale={[-1, 1, 1]} material={skymat}> {/* Inverted normals */}
      <sphereGeometry args={[500, 60, 40]} />
    </mesh>
    )
}

