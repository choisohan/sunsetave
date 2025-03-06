import React from 'react'
import House from './House'
import { Canvas } from '@react-three/fiber'


export default function HouseBuilder() {
  return (
    <Canvas style={{width:'800px',height:'500px'}}  camera={{position: [2,5,7], fov: 50}} >
        <House />
    </Canvas>
  )
}
