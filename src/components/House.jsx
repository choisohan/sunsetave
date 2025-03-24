import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import moment from 'moment-timezone';

import {SampleCalendars} from '../calendar/SampleCalendars'
import { fetchCalendar } from '../calendar/FetchCalendar';
import { getCurrentEventIndex, SortCalendarData } from '../calendar/SortEvents';
import { Vector3 } from 'three';


export default function House(props){
  const modelContext = useHouseModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  const [property, setProperty] = useState({
    id: 'sample/?SampleCalendar' ,
    roof:'R1', windows:'W1', wall: 'W1',  time: 0,
  });
  const [isHovered, setIsHovered] = useState(false); 
  const meshRef = useRef();


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




  //Tempoary Timelapse
  /*
  useFrame(()=>{
    if(mesh && mesh.material){
      mesh.material.forEach( mat =>{
        mat.uniforms.uTime.value = .001 + mat.uniforms.uTime.value ;
      })
    }
  })
    */

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
  if(mesh && property.events ){
    return <mesh ref={meshRef}
                position ={ property.position ||  [0,0,0] }
                rotation = {property.rotation ||  [0,0,0] } 
                onPointerEnter={()=>{setIsHovered(true)}}
                onPointerOut={()=>{setIsHovered(false)}}
                onClick={()=>{props.onClick()}}>

        <primitive object={mesh} scale={[1.2,1.2,1.2]}/>
            <EventStateBubble content={ property.events[currentEventIndex].summary }/>
        </mesh>
  }


}

const EventStateBubble = (props)=>{
  return <Html position={[0, .85, -0.25]} center style={{
    background:'white', padding: '5px'
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
