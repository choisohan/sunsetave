import React from 'react'
import {  Canvas} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';


export default function Scene(props){


    return (
        <Canvas style={!props.style? {width:'100vw',height:'100vh'} : props.style}  camera={{position: [2,5,7], fov: 50}} >
            <OrbitControls />
            {props.children}
        </Canvas>)
}
