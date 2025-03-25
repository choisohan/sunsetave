import React, { useEffect } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OceanMaterial } from '../shaders/WaterMaterial';
import { useSkyColorMap, useTime } from '../contexts/envContext';



export default function Sky() {
    const skyColorMap = useSkyColorMap();
    const time = useTime();

    const [skymat, setSkyMat] = useState(SkyMaterial(skyColorMap, time ));



    useEffect(()=>{
      skymat.uniforms.uTime.value = time; 
    },[time])

  return (
    <mesh scale={[-1, 1, 1]} material={skymat}>
      <sphereGeometry args={[100, 8, 8]} />
    </mesh>
    )
}

