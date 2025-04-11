import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment-timezone';
import { Vector3  } from 'three';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { useFrame } from '@react-three/fiber';
import { getCurrentEventIndex  } from '../calendar/SortEvents';
import {FindCalendar} from '../calendar/FetchCalendar'
import { useThree } from '@react-three/fiber';
import { useTimestamp } from '../contexts/envContext';
import EventBubble from './EventBubble';
import { UpdateHouseMesh, updateUtimes} from './UpdateHouseMesh';


export default function House(props){
  const { gl } = useThree(); 
  const modelContext = useHouseModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  const [property, setProperty] = useState({});
  const [isHovered, setIsHovered] = useState(false); 
  const meshRef = useRef();
  const timestamp = useTimestamp();


  useEffect(()=>{

    if( props.property.id !== property.id ){
      FindCalendar(props.property.id).then( calendar =>{
        setProperty((_property)=>({..._property, ...props.property , ...calendar  }))
      }).catch(err =>{})
    }
    else{
      setProperty(_property =>({..._property, ...props.property   }))
    }
  },[  props.property  , property.id ])


  useEffect(()=>{
     // props.onUpdateProperty( property );
  },[property , props])


  useEffect(()=>{
    if ( modelContext && TextureContext ) {
      setMesh( UpdateHouseMesh(modelContext , TextureContext, property))
    }
  },[ modelContext , TextureContext , property ])



  useEffect(()=>{
    if(!mesh) return;

    updateUtimes(mesh.material , timestamp, property.timezone);//material , timestamp  , timezone

    if(property.events){
      const _currentIndex = getCurrentEventIndex( property.events ,timestamp );  
      const _currentEvent = property.events[_currentIndex];
      if( new moment().isBetween(_currentEvent.startMoment, _currentEvent.endMoment ) ) setCurrentEventIndex(_currentIndex);  
    }


  },[ timestamp, property , mesh ])


  useFrame(()=>{
    if(!meshRef.current) return;

    if(isHovered){
      meshRef.current.scale.lerp( new Vector3(.9,1.2,.9),.5 )
    }
    else{
      meshRef.current.scale.lerp( new Vector3(1.,1.,1.),.5 )
    }
  })

  useEffect(()=>{
    gl.domElement.style.cursor = 'pointer'
    if(isHovered){
      gl.domElement.mouseOverItem = property.id;
    }
    else{
      if(gl.domElement.mouseOverItem === property.id){
        gl.domElement.style.cursor = ''
      }
    }
  },[isHovered , gl.domElement , property.id ])

  // Render
  if(! mesh   ) return; 

  return <mesh ref={meshRef} 
  position ={ property.position ? [property.position.x, property.position.y, property.position.z] :   [0,0,0] }
  rotation = {property.rotation ? [0, property.rotation.z,0] :   [0,0,0] }
              onPointerEnter={()=>{setIsHovered(true)}}
              onPointerOut={()=>{setIsHovered(false)}}
              onClick={()=>{ props.onClick(property) }}>

      <primitive object={mesh} scale={[.75,.75,.75] } />
      <EventBubble isHovered={isHovered} mesh={mesh} events={property.events ? property.events : [] } currentEventIndex={currentEventIndex} />
</mesh>
}



