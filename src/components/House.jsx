import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import moment from 'moment-timezone';

import {SampleCalendars} from '../calendar/SampleCalendars'
import { fetchCalendar } from '../calendar/FetchCalendar';
import { getCurrentEventIndex, SortCalendarData } from '../calendar/SortEvents';
import { Vector3 , Box3 } from 'three';


export default function House(props){
  const modelContext = useHouseModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  const [property, setProperty] = useState({
    roof:'R1', windows:'W1', wall: 'W1',  time: 0,
  });
  const [isHovered, setIsHovered] = useState(false); 
  const meshRef = useRef();
  const [meshHeight, setMeshHeight] = useState(0);


  useEffect(()=>{
    if( props.property.id !==property.id ){
      FindCalendar(props.property.id).then( calendar =>{
        const normTime = NormalizedCurrentTime(calendar.timezone) ;
        setProperty(_property =>(
          {..._property, ...props.property , ...calendar, time: normTime  }
        ))
        setCurrentEventIndex(getCurrentEventIndex(calendar.events))
      })

    }
    
    else{
      setProperty(_property =>(
        {..._property, ...props.property   }
      ))
    }
  },[props.property])






  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();
    }
  },[ modelContext , TextureContext , property ])


  const updateMap = (_mat) =>{
    if(_mat.name.toLowerCase() in property){
      const texturefullName = _mat.name.toLowerCase() + '/'+ property[_mat.name.toLowerCase()]
      _mat.uniforms.uMap.value =TextureContext[texturefullName]
      _mat.uniforms.uTime.value= property.time
    }
  }


  function updateMesh(){

    var meshFound = modelContext[property.mesh]; 
    if(!meshFound){
      meshFound = Object.values(modelContext)[0]
      const bbox = new Box3().setFromObject(meshFound);
      const size = new Vector3();
      bbox.getSize(size);
      setMeshHeight(size.y);
    }
  
    setMesh( ()=>{
      const newMesh = SkeletonUtils.clone( meshFound );
      if(Array.isArray(newMesh.material)){
        newMesh.material= newMesh.material.map( mat =>{
          var newMat =  mat.clone();
          updateMap(newMat)
          return newMat; 
        })
      }

      return newMesh
    })



    
  }


  useFrame(()=>{
    if(!meshRef.current) return;

    if(isHovered){
      meshRef.current.scale.lerp( new Vector3(.9,1.2,.9),.5 )
    }
    else{
      meshRef.current.scale.lerp( new Vector3(1.,1.,1.),.5 )
    }

  })


  // Render
  if( mesh ){
    return <mesh ref={meshRef}
                position ={ property.position ||  [0,0,0] }
                rotation = {property.rotation ||  [0,0,0] } 
                onPointerEnter={()=>{setIsHovered(true)}}
                onPointerOut={()=>{setIsHovered(false)}}
                onClick={()=>{props.onClick(property)}}>

        <primitive object={mesh}/>
            <EventStateBubble content={ property.events ? property.events[currentEventIndex].summary :'' } height={meshHeight} />
        </mesh>
  }


}

const EventStateBubble = (props)=>{
  return <Html zIndexRange={[0, 1]} style={{ transform: "none" }} position={[0, props.height , -0.25]} center style={{
    background:'white', padding: '5px' , transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1
    }}>
    {props.content}
    </Html>
}


const NormalizedCurrentTime = ( timezone )=>{
  const currentMoment = moment().tz(timezone)
  const minutesOfDay = currentMoment.hour() * 60 + currentMoment.minute();
  return  minutesOfDay / 1440;
}


const FindCalendar = async(_id)=>{
  var cal; 
  if(_id.includes('sample/?')){
    _id = _id.split('sample/?')[1];
    cal = await SampleCalendars[_id]
  }else{
    cal =  await fetchCalendar(_id);
  }
  return await SortCalendarData(cal);
}
