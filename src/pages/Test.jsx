import React, { useEffect }  from 'react'
import Sky from '../components/Sky'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
export default function Test() {

  useEffect(()=>{


  })

  return (<>
  <Canvas style={{width:'100vw', height:'100vh' }} >

  <mesh>
    <boxGeometry args={[1,1,1]} />
  </mesh>
  <OrbitControls />
 
  <Sky />
  </Canvas>
  
  
  </>

  )
}
