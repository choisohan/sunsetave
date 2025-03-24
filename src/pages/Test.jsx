import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import TerrainMesh from '../components/TerrainMesh'
import Sky from '../components/Sky'
import { Pixelate } from '../shaders/CustomPostProcessing'
import { SkyMaterial } from '../shaders/SkyMaterial'

export default function Test() {

    const [faces, setFaces] = useState([])

    const onMeshUpdate = (mesh)=>{
        const faceIndexArray = [1,2,3,4,]
        setFaces(faceIndexArray.map(index =>{
            const face = mesh.children[index];
            return face; 
        }));
    }


    return (
    <div><Canvas style={{width:'100vw', height:'100vh'}}  camera={{position: [1,1,1], fov: 20}} >
        <OrbitControls />
       
        <Pixelate />
        <mesh material ={SkyMaterial()} >
            <boxGeometry args = {[1,0.1,1]} />
        </mesh>
{/**
 *  <TerrainMesh onMeshUpdate={onMeshUpdate} />
        {faces.map( f =>(
            <mesh position ={f.position} rotation ={f.rotation} >
                <boxGeometry args = {[0.5, 0.5,.5]} />
            </mesh>
            ))}

 */}

       
    </Canvas></div>
    )
}



