import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { OceanMaterial } from '../shaders/WaterMaterial';
import { useTexture } from '../contexts/modelContext';
import { useFrame } from '@react-three/fiber';


export default function Ocean() {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const [mat, setMat] = useState( OceanMaterial() );
    const timeRef = useRef(0);

    useEffect(()=>{
        mat.uniforms.uTime.value = timestampToHourFloat( timestamp , null );
    },[timestamp])

    useEffect(()=>{
      if(!textureContext)return;
      mat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'] 
      mat.uniforms.uPerlinNoiseMap.value = textureContext['common/PerlinNoise'] 
    },[textureContext])

    useFrame((state, delta)=>{
      timeRef.current += delta; // delta is time in seconds since last frame

      mat.uniforms.uFrame.value = timeRef.current; 

    })

  return (
    <mesh  rotation={[-Math.PI / 2, 0, 0]} material={mat} position={[0,-1,0]}>
      <planeGeometry args={[500,500]}/>
    </mesh>
    )
}

