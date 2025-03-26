import React from 'react'
import Sky

from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton } from '../components/Buttons'
import Clock from '../components/Clock'
import TerrainMesh from '../components/TerrainMesh'




export default function Lookdev() {
  return (<>
      <Canvas camera={{position: [0,10,30], fov:60}}  style={{width:'100vw', height:'100vh' }}   >
        <color attach="background" args={["#074200"]} />
         <OrbitControls />
        <Sky />
        <TerrainMesh editMode={false} onGridUpdate={_=>{}}/> 
    </Canvas>
  
  <div className='fixed z-[1] bottom-0 right-0 p-5 ' >
    <div className='bg-white p-2' >
      <Clock />
    {Intl.DateTimeFormat().resolvedOptions().timeZone}
    </div>
      <SkipBackwardButton />
      <SkipForwardButton />
    </div>
  </>

  )
}
