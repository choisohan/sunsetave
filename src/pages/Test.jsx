import React, { useEffect, useRef, useState }  from 'react'
import Sky from '../components/Sky'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import TerrainMesh from '../components/TerrainMesh'
import InstancingOnGrid from '../components/InstancingOnGrid'
import SVGTerrain from '../components/SVGTerrain'
import { Euler, Vector3 } from 'three'
import LeavesMaterial from '../shaders/LeavesMaterial'

export default function Test() {


  const [grid, setGrid] = useState([]);

  const [transform, setTransform] = useState({
    position: new Vector3(0,5,9), rotation: new Vector3()
  });

  const meshRef = useRef();

  useEffect(()=>{
    console.log( meshRef.current)
  },[])



  const onClick = (i)=>{
    const selected = grid[i];
    setTransform(selected);
  }

  return (<>
    <Canvas camera={{position: [0,70,50], fov:30}}  style={{width:'100vw', height:'100vh', backgroundColor:"pink" }}   >
        
        <OrbitControls />


        <mesh material ={LeavesMaterial()} ref={meshRef} >
          <torusKnotGeometry args={[10, 3, 100, 16]}  />
        </mesh>

{/*
        <group >
          <TerrainMesh editMode={true} setGrids={setGrid} onMouseEnter={()=>{}} onClick={onClick} />          
        </group>
              <mesh position={transform.position}>
        <boxGeometry args={[5,5,5]} />
        <meshBasicMaterial color="red"/>
      </mesh>

*/}







{/*
//Testing initial Instancing Concept
        <InstancingOnGrid grid={grid} count={10} speed={2} />
*/}



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
