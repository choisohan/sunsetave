import React, {useEffect  , useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber';

export default function CameraControls(props) {

  const { camera } = useThree();
  const controlsRef = useRef();

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

  useEffect(()=>{
    if(props.position){
      camera.position.set(props.position.x,props.position.y, props.position.z );

    }
    if(props.target){
      controlsRef.current.target.set(props.target.x,props.target.y,props.target.z);
      controlsRef.current.update();
    }

    //camera.updateProjectionMatrix(); // optional but good to call

  },[ camera  ])

  return (
        <OrbitControls ref={controlsRef} 
          onEnd={onEnd}
          maxDolly ={0}
          minPolarAngle={-Math.PI / 2} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={0} 
          maxDistance={90}
          enablePan={'enablePan' in props ? props.enablePan : true}
          enableZoom={'enableZoom' in props ? props.enableZoom : true}
          />
    
  )
}
