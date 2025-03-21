import React, { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'

export default function CameraControls() {

  const maxPanDistance = 1.5; 


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
          target={new Vector3(0,0.05,0)}
          maxDolly ={0}
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2} 
          minAzimuthAngle={-Math.PI / 4} 
          maxAzimuthAngle={Math.PI / 4} 
          minDistance={0} 
          maxDistance={10}
          enablePan={true} />
    
  )
}
