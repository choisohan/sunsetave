import React, {useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'

export default function CameraControls(props) {

  const targetRef = useRef(props.target ||  new Vector3(0,0.35,0) ); 

  const onEnd = (e)=>{
    /*
    const maxPanDistance = 1.5; 
    const direction = e.target.target.sub(new Vector3(0.,.0,.0));
    const length = direction.length();   
    if(length > maxPanDistance){
      direction.normalize().multiplyScalar(maxPanDistance);
      e.target.target = direction;
      e.target.update();
    }
      */ 
  }

  return (
        <OrbitControls
          onEnd={onEnd}
          target={targetRef.current}
          maxDolly ={0}
          minPolarAngle={-Math.PI / 2} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={0} 
          maxDistance={90}
          enablePan={true} />
    
  )
}
