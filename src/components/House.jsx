import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useModel , useTexture } from '../contexts/modelContext';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import moment from 'moment-timezone';

import {SampleCalendars} from '../calendar/SampleCalendars'
import { fetchCalendar } from '../calendar/FetchCalendar';
import { getCurrentEventIndex, SortCalendarData } from '../calendar/SortEvents';



export default function House(props){
  const modelContext = useModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  

  const [property, setProperty] = useState({
    id: 'sample/?SampleCalendar' ,
    x:0,y:0, roof:'R1', windows:'W1', wall: 'W1',  time: 0,    
  });

  useEffect(()=>{
    if(props.property.id){
      FindCalendar(props.property.id).then( calendar =>{
        const normTime = NormalizedCurrentTime(calendar.timezone) ;
        setProperty(_property =>(
          {..._property, ...props.property , ...calendar, time: normTime  }
        ))

        setCurrentEventIndex(getCurrentEventIndex(calendar.events))
      })
    }
  },[props.property])


  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();

    }
  },[ modelContext , TextureContext , property ])



  //Tempoary Timelapse
  useFrame(()=>{
    /*
    if(mesh && mesh.material){
      mesh.material.forEach( mat =>{
        mat.uniforms.uTime.value = .01 + mat.uniforms.uTime.value ;
      })
    }
      */
  })

  const updateMap = (_mat) =>{
    if(_mat.name in property){
      const texturefullName = _mat.name + '/'+ property[_mat.name]
      _mat.uniforms.uMap.value =TextureContext[texturefullName]
      _mat.uniforms.uTime.value= property.time
      console.log( property.name, property.time  )
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

  function onMouseOver(_isMouseOver){
    mesh.material.forEach(mat=>{
      mat.uniforms.uMouseOver.value = _isMouseOver;
      mat.needsUpdate = true;  
    })
  }


  // Render
  if(mesh){
    return <mesh position ={[property.x, 0, property.y]}
                onPointerOver={()=>{onMouseOver(true)}}
                onPointerOut={()=>{onMouseOver(false)}}
                onClick={()=>{props.onClick()}}>

        <primitive object={mesh}/>

        <Html position={[0, .75, 0]} center>
          <div>{property.events ? property.events[currentEventIndex].summary : null }</div>
        </Html>
        
        </mesh>
  }


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
