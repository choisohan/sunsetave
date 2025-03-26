import React from 'react'
import Sky

from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton } from '../components/Buttons'
import Clock from '../components/Clock'
import { OceanMaterial } from '../shaders/WaterMaterial'
import { useTime } from '../contexts/envContext'
import { useSkyColorMap } from '../contexts/envContext'



export default function Lookdev() {

  const time = useTime();
    const skyColorMap = useSkyColorMap();

  const Ocean = (
    <mesh material={OceanMaterial(skyColorMap, time)}>
      <boxGeometry args={[10,.01,10]} />

  </mesh>
  )


  return (<>
      <Canvas camera={{position: [0,7,10], fov:30}}  style={{width:'100vw', height:'100vh' }}   >
        
         <OrbitControls />
         <Sky />


        {Ocean}

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
