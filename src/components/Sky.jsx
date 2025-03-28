import React, { useEffect } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useSkyColorMap, useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';


export default function Sky() {
    const skyColorMap = useSkyColorMap();
    const timestamp = useTimestamp();

    const [skymat, setSkyMat] = useState( SkyMaterial(skyColorMap));



    useEffect(()=>{
      skymat.uniforms.uTime.value = timestampToHourFloat(timestamp);
      skymat.uniforms.uTimestamp.value = timestamp ;
    },[timestamp])

  return (
    <mesh  material={skymat}>
      <sphereGeometry args={[100, 16, 16]} />
    </mesh>
    )
}

