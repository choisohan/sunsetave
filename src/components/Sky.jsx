import React from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Sky() {

    const [skymat, setSkyMat] = useState(SkyMaterial());

    /*
    useFrame(()=>{
      if( skymat ){
        const uTime = (skymat.uniforms.uTime.value+ .0025);
        skymat.uniforms.uTime.value = uTime;
      }
    })
      */



  return (
    <mesh scale={[-1, 1, 1]} material={skymat}>
      <sphereGeometry args={[100, 8, 8]} />
    </mesh>
    )
}

