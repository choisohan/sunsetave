import React, { useEffect } from 'react'
import { useState } from 'react';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { OceanMaterial } from '../shaders/WaterMaterial';
import { useTexture } from '../contexts/modelContext';


export default function Ocean() {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const [mat, setMat] = useState( OceanMaterial() );

    useEffect(()=>{
        mat.uniforms.uTime.value = timestampToHourFloat(timestamp);
    },[timestamp])

    useEffect(()=>{
      mat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'] 
      mat.uniforms.uPerlinNoiseMap.value = textureContext['common/PerlinNoise'] 

    },[textureContext])

  return (
    <mesh  rotation={[-Math.PI / 2, 0, 0]} material={mat} position={[0,-1,0]}>
      <planeGeometry args={[500,500]}/>
    </mesh>
    )
}

