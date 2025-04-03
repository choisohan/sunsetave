import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSkyColorMap, useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { OceanMaterial } from '../shaders/WaterMaterial';

export default function Ocean() {
    const skyColorMap = useSkyColorMap();
    const timestamp = useTimestamp();

    const [mat, setMat] = useState( OceanMaterial(skyColorMap, timestamp) );



    useEffect(()=>{
        mat.uniforms.uTime.value = timestampToHourFloat(timestamp);
    },[timestamp])

  return (
    <mesh  rotation={[-Math.PI / 2, 0, 0]} material={mat} position={[0,-1,0]}>
      <planeGeometry args={[500,500]}/>
    </mesh>
    )
}

