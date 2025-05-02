import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment-timezone';
import { Vector3  } from 'three';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { getCurrentEventIndex  } from '../calendar/SortEvents';
import {FindCalendar} from '../calendar/FetchCalendar'
import { useThree , useFrame  } from '@react-three/fiber';
import { useTimestamp, useTimezoneOverride } from '../contexts/envContext';
import EventBubble from './EventBubble';
import { getMeshHeight, UpdateHouseMesh, updateUtimes} from './UpdateHouseMesh';
import { Html } from '@react-three/drei';




export default function House(props){
  // GLOVAL HOOKS
  const { gl } = useThree(); 
  const modelContext = useHouseModel();
  const TextureContext = useTexture(); 
  const timestamp = useTimestamp();
  const timezoneOverride = useTimezoneOverride(); 


  // STATES
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  const [property, setProperty] = useState({});
  const [isHovered, setIsHovered] = useState(false); 
  const [position,setPosition] = useState();
  const [rotation, setRotation] = useState();

  //REFS
  const meshRef = useRef();
  const audioRef = useRef();


  //ETC
  const updateTime = "updateTime" in props?  props.updateTime  : true; 


  useEffect(()=>{
    if(!props.id) return; 

    console.log('search  -> ' , props.id )
    FindCalendar(props.id).then( calendar =>{
      const updatedProperty = { ...property, ...calendar , id: props.id };
      setProperty(updatedProperty)
      if( props.onUpdateProperty)props.onUpdateProperty( updatedProperty )
    }).catch(err =>{
      console.log( '🔴'+err)
      if( props.onUpdateProperty) props.onUpdateProperty();
    })
  },[props.id])
  

  useEffect(()=>{
    setProperty(x=>({...x, ...props.design }))
   },[props.design] )
 


  useEffect(()=>{
    if ( modelContext && TextureContext ) {
      setMesh(  UpdateHouseMesh(modelContext , TextureContext, property) )
    }
  },[ modelContext , TextureContext , property ])



  useEffect(()=>{
    if(!mesh) return;

    if(updateTime){
      const tz = timezoneOverride || property.timezone;
      updateUtimes(mesh.material , timestamp, tz);
    }

    if(property.events){
      const _currentIndex = getCurrentEventIndex( property.events ,timestamp );  
      const _currentEvent = property.events[_currentIndex];
      if( new moment(timestamp).isBetween(_currentEvent.startMoment, _currentEvent.endMoment ) ) setCurrentEventIndex(_currentIndex);  
      if( props.timeout === 'infinite') setCurrentEventIndex(_currentIndex)
    }


  },[ timestamp, property , mesh , updateTime , timezoneOverride  ])


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
  },[isHovered ])


  useEffect(()=>{
    const hoverable = "hoverable" in props ? props.hoverable : true; 

    if(  isHovered && audioRef.current  && hoverable ){
        audioRef.current.volume = .2;
        audioRef.current.play().catch(err=>{
        })
      }
},[isHovered ])

  useEffect(()=>{
    if( props.transform  && props.transform.position && props.transform.rotation  ){
      setPosition([props.transform.position.x,props.transform.position.y ,props.transform.position.z])
      setRotation([0,props.transform.rotation.z,0])
    }
  },[ props.transform ])


  useFrame(()=>{
    if(!meshRef.current) return;

    const hoverable = "hoverable" in props ? props.hoverable : true; 
    if( hoverable && isHovered){
      meshRef.current.scale.lerp( new Vector3(.9,1.2,.9),.5 )
    }
    else{
      meshRef.current.scale.lerp( new Vector3(1.,1.,1.),.5 )
    }
  })


  const onClick = e =>{
    if(props.onClick) props.onClick (property)
    if(props.onClickSurface) props.onClickSurface (e)
  }


  const onPointerOut = (e)=>{
    setIsHovered(false)
    if(props.onPointerOut){
      props.onPointerOut(e)
    }
  }






  // Render
    return <mesh ref={meshRef} 
                position ={ position} rotation = {rotation}
                onPointerEnter={()=>{setIsHovered(true)}}
                onPointerOut={onPointerOut}
                onClick={onClick} onContextMenu={onClick}
                >

      <EventBubble calName={property.name }
                    event={ property.events && currentEventIndex  ? property.events[currentEventIndex] : null }
                    position={[ 0 , getMeshHeight(meshRef.current) -.75  , -.5 ]}
                    timeout={props.timeout}
                    isHovered={isHovered}/>   


      <Html><audio ref={audioRef} src="/audios/jump.wav" /></Html>

      {mesh ? <primitive object={mesh} scale={[.75,.75,.75] } /> : <Html>Loading</Html>}

      
    </mesh>
  }





