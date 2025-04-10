import React, { useEffect } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useState } from 'react';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';


export default function Sky(props) {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const [mat, setMat] = useState( SkyMaterial());
    const [timezone, setTimezone] = useState( props.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(()=>{
      setTimezone(props.timezone);
    },[props])

    useEffect(()=>{
      mat.uniforms.uTime.value = timestampToHourFloat( timestamp , timezone );
      mat.uniforms.uTimestamp.value =  (Math.floor(timestamp/100000)%1000)/1000;
    },[ timezone, timestamp])


    useEffect(()=>{
      if(!textureContext)return;

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

