import React, { useRef } from 'react'
import { Html } from '@react-three/drei';

export const InteractiveMesh =({object})=>{
    const audioRef = useRef();

    const onPointerMove = (e)=>{
        const material = e.object.material
        if(material.uniforms.uPoint)  material.uniforms.uPoint.value = e.point; 
        playAudio();
    }

    const playAudio = ()=>{
        if(!audioRef.current) return; 

        audioRef.current.volume = .025;
        audioRef.current.play().catch(err=>{})
    }

    return <>
    <mesh onPointerMove={onPointerMove} ><primitive object={object} /></mesh>
    <Html><audio ref={audioRef} src="/audios/touchBush.wav" /></Html>
    </>
}