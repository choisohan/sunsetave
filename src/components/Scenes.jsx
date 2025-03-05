import React from 'react'
import {  Canvas} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';


export default function Scene(props){


    return (
        <Canvas style={{width:'100vw',height:'100vh', background: 'gray'}}  camera={{position: [2,5,7], fov: 50}} >
            <OrbitControls />
            {props.children}
        </Canvas>)
}
