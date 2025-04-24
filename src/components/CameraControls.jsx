import React, {useEffect , useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber';

export default function CameraControls(props) {

  const { camera } = useThree();
  const [target, setTarget] = useState();

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
    console.log('?')
    if(props.position){
      camera.position.set(props.position.x,props.position.y, props.position.z );

    }
    if(props.target){
      setTarget([props.target.x,props.target.y,props.target.z]);
    }

    //camera.updateProjectionMatrix(); // optional but good to call

  },[  props.position , props.target  ])


  
  return (
        <OrbitControls
          onEnd={onEnd}
          target={target}
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
