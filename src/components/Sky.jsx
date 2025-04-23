import React, { useEffect, useRef } from 'react'
import { SkyMaterial } from '../shaders/SkyMaterial'
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';

export default function Sky(props) {
    const timestamp = useTimestamp();
    const textureContext = useTexture();
    const matRef = useRef(SkyMaterial()); 

    
    useEffect(()=>{
      const tz =  props.timezone  || Intl.DateTimeFormat().resolvedOptions().timeZone; 

      var _timestamp = timestamp;
      if(props.timeDiff) _timestamp += props.timeDiff; 
      matRef.current.uniforms.uTime.value = timestampToHourFloat( _timestamp , tz );
      matRef.current.uniforms.uTimestamp.value =  (Math.floor(_timestamp/100000)%1000)/1000;
    },[  props.timezone  , timestamp,props.timeDiff ])


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

