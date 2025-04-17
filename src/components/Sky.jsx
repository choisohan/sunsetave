import React, { useEffect, useRef } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useTimestamp , useTimezoneOverride } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';

export default function Sky(props) {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const matRef = useRef(SkyMaterial()); 
    const timezoneOverride = useTimezoneOverride(); 

    
    useEffect(()=>{
      const tz = timezoneOverride || props.timezone  || Intl.DateTimeFormat().resolvedOptions().timeZone; 
      matRef.current.uniforms.uTime.value = timestampToHourFloat( timestamp , tz );
      matRef.current.uniforms.uTimestamp.value =  (Math.floor(timestamp/100000)%1000)/1000;
    },[ timezoneOverride , timestamp])


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

