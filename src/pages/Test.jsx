import React, { useEffect , useRef }  from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import { Pixelate } from '../shaders/CustomPostProcessing'
import LeavesMaterial from '../shaders/LeavesMaterial'
import { useTexture } from '../contexts/modelContext'
import { HouseMaterial } from '../shaders/houseMaterial'





export default function Test() {

  const leafMat = useRef(LeavesMaterial());
  const houseMat = useRef(HouseMaterial());

  const textureContext = useTexture();


  useEffect(()=>{
    if(!textureContext)return;
    
    leafMat.current.uniforms.uSkyColorMap.value = textureContext['env/skyColormap']
    leafMat.current.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal']
    
    houseMat.current.uniforms.uIsWindow.value=true;
  },[textureContext])

  return (<>
    <Canvas camera={{position: [0,0,50], fov:30}}  style={{width:'100vw', height:'100vh'}}  >
        
        <OrbitControls />
{/*

        <mesh material={leafMat.current} position={[-5,0,0]}>
          <sphereGeometry args={[5,10,10,10]}/>
        </mesh>

*/}

        <mesh material={houseMat.current}>
          <boxGeometry args={[9,9,9]}/>
        </mesh>

    <Pixelate />
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
