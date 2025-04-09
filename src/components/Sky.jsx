import React, { useEffect } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';


export default function Sky() {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const [mat, setMat] = useState( SkyMaterial());

    useEffect(()=>{
      mat.uniforms.uTime.value = timestampToHourFloat(timestamp);
      mat.uniforms.uTimestamp.value = timestamp /10000000000;
    },[timestamp])


    useEffect(()=>{
      mat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'] ;
      mat.uniforms.uPerlinNoiseMap.value = textureContext['common/PerlinNoise'] ;
      mat.uniforms.uCloudMap.value = textureContext['env/clouds'] ;
    },[textureContext])


  return (
    <mesh  material={mat}>
      <sphereGeometry args={[100, 16, 16]} />
    </mesh>
    )
}

