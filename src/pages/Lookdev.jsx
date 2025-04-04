import React, { useEffect } from 'react'
import Sky from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import { OceanMaterial } from '../shaders/WaterMaterial'
import { useTimestamp } from '../contexts/envContext'

import TestMaterial from '../shaders/TestMaterial'
import TerrainMesh from '../components/TerrainMesh'
import { useTexture } from '../contexts/modelContext'



export default function Lookdev() {

    const timestamp = useTimestamp();




  return (<>
      <Canvas camera={{position: [0,7,10], fov:30}}  style={{width:'100vw', height:'100vh' }}   >
        
         <OrbitControls />
         <Sky />


<TerrainMesh editMode={false} onGridUpdate={()=>{}}onMouseMoveOnGrid={()=>{}} onComplete={()=>{}} />

      <mesh position={[0,0,0]} material={TestMaterial()}>
        <sphereGeometry args={[1,20,20]} />  
      </mesh>     

      <mesh position={[2,0,0]} material={TestMaterial()}>
        <boxGeometry args={[1,1,1]} />  
      </mesh>     
    </Canvas>
  
  <div className='fixed z-[1] bottom-0 right-0 p-5 ' >
    <div className='bg-white p-2' >
      <Clock />
    {Intl.DateTimeFormat().resolvedOptions().timeZone}
    </div>
      <SkipBackwardButton />
      <FastForwardButton />
      <SkipForwardButton />
    </div>
  </>

  )
}
