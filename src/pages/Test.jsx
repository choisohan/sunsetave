import React, { useEffect  }  from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Pixelate } from '../shaders/CustomPostProcessing'
import { useTexture } from '../contexts/modelContext'

import House from '../components/House'
import Sky from '../components/Sky'
import EmojiEffector, { EmojiParticles } from '../components/EmojiEffector'
import EventBubble from '../components/EventBubble'

export default function Test() {

  const textureContext = useTexture();

  const testEvent={
    summary: "🥐Baking",
    start: "2025-03-06T06:00:00",
    end: "2025-03-06T07:00:00",
    rrule: "FREQ=DAILY;INTERVAL=1" }

  useEffect(()=>{
    if(!textureContext)return;
  },[textureContext])

  return (<>
    <Canvas camera={{position: [5,5,10], fov:20}}  style={{width:'100vw', height:'100vh'}}  >
        
        <Sky />
        <OrbitControls target ={[0,1,0]} />
        
        <House property={{ time: .5 , mesh: 1 , roof : 1, wallA:1, wallB:1, door:1, shade:1, windowsA:1, windowsB:1 }}
                onClick={()=>{}} updateTime={false} onUpdateProperty={()=>{}}/>

    <Pixelate />
    </Canvas>
  </>

  )
}
