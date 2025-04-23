import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment-timezone';
import { Vector3  } from 'three';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { useFrame } from '@react-three/fiber';
import { getCurrentEventIndex  } from '../calendar/SortEvents';
import {FindCalendar} from '../calendar/FetchCalendar'
import { useThree } from '@react-three/fiber';
import { useTimestamp, useTimezoneOverride } from '../contexts/envContext';
import EventBubble from './EventBubble';
import { getMeshHeight, UpdateHouseMesh, updateUtimes} from './UpdateHouseMesh';
import { Html } from '@react-three/drei';
import { useUpdatePopup } from '../contexts/PopupContext';
import HouseDetailWindow from './HouseDetailWindow';

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
  const updateTime = "updateTime" in props?  props.updateTime  : true; 
  const audioRef = useRef();
  const height = useRef(0);
  const setPopup = useUpdatePopup();
  const timezoneOverride = useTimezoneOverride(); 
  const [position,setPosition] = useState();
  const [rotation, setRotation] = useState();

  useEffect(()=>{
   setProperty(x=>({...x, ...props.design }))
  },[props.design] )


  useEffect(()=>{
    if( props.id  && props.id !== property.id ){
      setMesh()
      FindCalendar(props.id).then( calendar =>{
        console.log(calendar)
        const updatedProperty = { ...property, ...calendar , id: props.id };
        setProperty(updatedProperty)
        if( props.onUpdateProperty)props.onUpdateProperty( updatedProperty )
      }).catch(err =>{
        console.log( '🔴'+err)
      })
    }
  },[  props.id   ])


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
    height.current = getMeshHeight(meshRef.current)
  },[mesh])


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


  useEffect(()=>{
    const hoverable = "hoverable" in props ? props.hoverable : true; 

    if(  isHovered && audioRef.current  && hoverable ){
        audioRef.current.volume = .2;
        audioRef.current.play().catch(err=>{
        })
      }
},[isHovered ])


const onClick = e =>{
  if(props.detailWindowOpen){
    setPopup(<HouseDetailWindow property={property} />)
  }

  if(props.onClick){
    props.onClick(e)
  }

}


const onPointerOut = (e)=>{
  setIsHovered(false)
  if(props.onPointerOut){
    props.onPointerOut(e)
  }
}

const onPointerMove = e=>{
  if(props.onPointerMove){
    props.onPointerMove(e)
  }
}

useEffect(()=>{
  if( props.transform  && props.transform.position && props.transform.rotation  ){
    setPosition([props.transform.position.x,props.transform.position.y ,props.transform.position.z])
    setRotation([0,props.transform.rotation.z,0])
  }

},[props.transform ])


  // Render
    return <mesh ref={meshRef} 
    position ={ position} rotation = {rotation}
                onPointerEnter={()=>{setIsHovered(true)}}
                onPointerOut={onPointerOut}
                onContextMenu={onClick}
                onPointerMove={onPointerMove}
                onClick={onClick}>



      {mesh ? <>
            
            <primitive object={mesh} scale={[.75,.75,.75] } />
                    <Html>
                      <audio ref={audioRef} src="/audios/jump.wav" />
                    </Html>
            
            
            <group position={[0,height.current-.75  ,-.5]}>
                <EventBubble calName={property.name } event={ property.events && currentEventIndex  ? property.events[currentEventIndex] : null } timeout={props.timeout}/>
            </group> 

          </> : <Html>Loading</Html>}
  </mesh>
  }





