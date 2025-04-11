import React, { useEffect , useRef }  from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SkipForwardButton , SkipBackwardButton, FastForwardButton } from '../components/Buttons'
import {Clock} from '../components/Clock'
import { Pixelate } from '../shaders/CustomPostProcessing'
import LeavesMaterial from '../shaders/LeavesMaterial'
import { useTexture } from '../contexts/modelContext'





export default function Test() {

  const matRef = useRef(LeavesMaterial());

  const textureContext = useTexture();


  useEffect(()=>{
    if(!textureContext)return;
    
    matRef.current.uniforms.uSkyColorMap.value = textureContext['env/skyColormap']
    matRef.current.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal']
    
  },[textureContext])

  return (<>
    <Canvas camera={{position: [0,0,50], fov:30}}  style={{width:'100vw', height:'100vh'}}   >
        
        <OrbitControls />

        <mesh material={matRef.current}>
          <sphereGeometry args={[5,10,10,10]}/>
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
