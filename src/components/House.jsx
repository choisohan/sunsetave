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
  const updateTime = props.updateTime || true; 
  const audioRef = useRef();
  const height = useRef(0);
  const setPopup = useUpdatePopup();
  const timezoneOverride = useTimezoneOverride(); 


  
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
     props.onUpdateProperty( property );
  },[property , props ])


  useEffect(()=>{
    if ( modelContext && TextureContext ) {
      setMesh( UpdateHouseMesh(modelContext , TextureContext, property))
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
},[isHovered])


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


  // Render
  if(! mesh   ) return; 

    return <mesh ref={meshRef} 
    position ={ property.position ? [property.position.x, property.position.y, property.position.z] :   [0,0,0] }
    rotation = {property.rotation ? [0, property.rotation.z,0] :   [0,0,0] }
                onPointerEnter={()=>{setIsHovered(true)}}
                onPointerOut={onPointerOut}
                onContextMenu={onClick}
                onPointerMove={onPointerMove}
                onClick={onClick}>

        <primitive object={mesh} scale={[.75,.75,.75] } />
        <Html>
          <audio ref={audioRef} src="/audios/jump.wav" />
        </Html>


        <group position={[0,height.current-.75  ,-.5]}>
            <EventBubble event={ property.events && currentEventIndex  ? property.events[currentEventIndex] : null } />
        </group> 
  </mesh>
}



