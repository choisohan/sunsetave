import { Canvas } from '@react-three/fiber'
import React from 'react'
import { OrbitControls } from '@react-three/drei'
import TerrainMesh from '../components/TerrainMesh'


export default function Test() {


    return (
    <div><Canvas style={{width:'100vw', height:'100vh'}}  camera={{position: [15,15,15], fov: 20}} >
        <OrbitControls />
        <TerrainMesh />
       
    </Canvas></div>
    )
}




