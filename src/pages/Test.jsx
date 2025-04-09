import React, { useEffect, useRef, useState }  from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import {  Vector3 } from 'three'
import { Pixelate } from '../shaders/CustomPostProcessing'
import Sky from '../components/Sky'
import LeavesMaterial from '../shaders/LeavesMaterial'
import { useTexture } from '../contexts/modelContext'





export default function Test() {


  const [grid, setGrid] = useState([]);

  const [transform, setTransform] = useState({
    position: new Vector3(0,5,9), rotation: new Vector3()
  });

  const [leaveMat,setLeaveMat] = useState(LeavesMaterial()); 

  const textureContext = useTexture();
  const meshRef = useRef();


  useEffect(()=>{
    if( textureContext){
      leaveMat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap']
      leaveMat.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal']
    }
  },[textureContext])


  const onClick = (i)=>{
    const selected = grid[i];
    setTransform(selected);
  }

  return (<>
    <Canvas camera={{position: [0,0,50], fov:30}}  style={{width:'100vw', height:'100vh'}}   >
        
        <OrbitControls />

        <mesh material={leaveMat}>
          <sphereGeometry args={[5,10,10,10]}/>
        </mesh>

    <Pixelate />





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
