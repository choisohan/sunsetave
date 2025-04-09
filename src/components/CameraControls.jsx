import React, { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import { SRGBColorSpace, NoToneMapping } from 'three';

export default function CameraControls(props) {

  const maxPanDistance = 1.5; 
  const [target,setTarget] = useState( props.target ||  new Vector3(0,0.35,0) );

  /*
  const {gl} = useThree();

  useEffect(()=>{
    console.log(  gl.outputColorSpace ,gl.toneMapping )
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = NoToneMapping;
    gl.setClearColor(0x000000, 1); // solid black background

  },[gl])
  */



  const onEnd = (e)=>{

    const direction = e.target.target.sub(new Vector3(0.,.0,.0));
    const length = direction.length();   
    if(length > maxPanDistance){
      direction.normalize().multiplyScalar(maxPanDistance);
      e.target.target = direction;
      e.target.update();
    }
  }

  return (
        <OrbitControls
          onEnd={onEnd}
          target={target}
          maxDolly ={0}
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2} 
          minAzimuthAngle={-Math.PI / 4} 
          maxAzimuthAngle={Math.PI / 4} 
          minDistance={0} 
          maxDistance={25}
          enablePan={true} />
    
  )
}
