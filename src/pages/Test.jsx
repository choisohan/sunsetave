import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Sky from "../components/Sky";
import Ocean from '../components/Ocean'
import LeavesMaterial from '../shaders/LeavesMaterial'
import { useEffect, useRef, useState } from "react";
import { useTexture } from "../contexts/modelContext";
import { Vector2, Vector3 } from "three";
import { HouseMaterial } from "../shaders/houseMaterial";
import * as Button from '../components/Buttons'
import { useTimestamp } from "../contexts/envContext";
import { timestampToHourFloat } from "../components/Clock";
export default function Test() {

  return <>
  <Canvas style={{width:"100vw", height: "100vh"}}  camera={{fov:20, position: [0,-1.2,15] }  }>
    <OrbitControls target={new Vector3(1,0,0)} />
    <Sky />
    <Ocean />
    <LeafMesh position={[-0.,0,0.]} />
    <GlassMesh position={[2.,0,0.]}  />
  </Canvas>


  <div className="fixed bottom-5 right-5 flex gap-2">

    <Button.SkipBackwardButton />
    <Button.SkipForwardButton />
    <Button.FastForwardButton />

  </div>
  
  </>

}

const LeafMesh = ({position})=>{
  const matRef = useRef(LeavesMaterial());
  const textureContext = useTexture();
  const timeRef = useRef(0);
  const timestamp = useTimestamp();


  if(textureContext){
    matRef.current.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal'];
    matRef.current.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'];
    matRef.current.uniforms.uMap.value = textureContext['P/CG'];
    matRef.current.uniforms.uMapRepeat.value = new Vector2(.35,.35 )
    matRef.current.uniforms.uNormalStrength.value = .15;
  }

  useFrame((state, delta)=>{
      timeRef.current += delta; // delta is time in seconds since last frame
      matRef.current.uniforms.uFrame.value =timeRef.current; 
  })

  useEffect(()=>{
    if(!matRef.current) return;
    matRef.current.uniforms.uTime.value = timestampToHourFloat( timestamp , Intl.DateTimeFormat().resolvedOptions().timeZone  );
  },[timestamp])

  return <mesh material={matRef.current} position={position}><sphereGeometry/></mesh>
}


const GlassMesh = ({position})=>{
  const matRef = useRef(HouseMaterial());
  const textureContext = useTexture();
  const timestamp = useTimestamp();
  useEffect(()=>{
    if(!matRef.current) return;
    matRef.current.uniforms.uTime.value = timestampToHourFloat( timestamp , Intl.DateTimeFormat().resolvedOptions().timeZone  );
  },[timestamp])
  if(textureContext){
    matRef.current.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'];
    matRef.current.uniforms.uMap.value = textureContext['W/W30'];
    matRef.current.uniforms.uIsWindow.value = true;

  }



  return <mesh material={matRef.current} position={position}><boxGeometry args={[1.,1.5,0]}/></mesh>
}