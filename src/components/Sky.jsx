import React, { useEffect, useRef } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';


export default function Sky(props) {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const matRef = useRef(SkyMaterial()); 
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(()=>{
      setTimezone(props.timezone);
    },[props])

    useEffect(()=>{
      matRef.current.uniforms.uTime.value = timestampToHourFloat( timestamp , timezone );
      matRef.current.uniforms.uTimestamp.value =  (Math.floor(timestamp/100000)%1000)/1000;
    },[ timezone, timestamp])


    useEffect(()=>{
      if(!textureContext)return;

      matRef.current.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'] ;
      matRef.current.uniforms.uPerlinNoiseMap.value = textureContext['common/PerlinNoise'] ;
      matRef.current.uniforms.uCloudMap.value = textureContext['env/clouds'] ;
    },[textureContext])


  return (
    <mesh  material={matRef.current}>
      <sphereGeometry args={[100, 16, 16]} />
    </mesh>
    )
}

