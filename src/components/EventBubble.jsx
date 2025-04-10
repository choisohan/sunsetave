import React ,{useRef,useEffect} from 'react'
import { Html } from '@react-three/drei'
import { getMeshHeight } from './UpdateHouseMesh'


export default function EventBubble({isHovered , events , currentEventIndex , mesh }) {
  const audioRef = useRef()
   
  

    useEffect(()=>{
        if(isHovered && audioRef.current ){
            audioRef.current.volume = .2;
            audioRef.current.play().catch(err=>{
            })
          }
    },[isHovered])

    if(!events) return; 
  return (
    <Html className='bubble' zIndexRange={[0, 1]} position={[0, getMeshHeight(mesh) +.5, -0.25]} center style={{
        transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1,}}>
            <span>{events[currentEventIndex].summary}</span>
    <audio ref={audioRef} src="/audios/jump.wav" />
    </Html>
          
    )
}
