import React ,{useRef,useEffect, useState} from 'react'
import { Html } from '@react-three/drei'
import { getMeshHeight } from './UpdateHouseMesh'


export default function EventBubble({isHovered , events , currentEventIndex , mesh }) {

  const audioRef = useRef();
  const [text, setText] = useState('Hello')
   
  
  useEffect(()=>{
    if(events && currentEventIndex ){
      const evt = events[currentEventIndex];
      if(evt){
        setText(evt.summary)
      }
    }

  },[events, currentEventIndex ])

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
            <span>{ text }</span>
    <audio ref={audioRef} src="/audios/jump.wav" />
    </Html>
          
    )
}
