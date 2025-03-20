import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import moment from 'moment-timezone';

import {SampleCalendars} from '../calendar/SampleCalendars'
import { fetchCalendar } from '../calendar/FetchCalendar';
import { getCurrentEventIndex, SortCalendarData } from '../calendar/SortEvents';



export default function House(props){
  const modelContext = useHouseModel();
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


  useEffect(()=>{
    console.log( 'mesh updated')
  },[mesh])

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

    console.log('updateMesh',meshFound )

    setMesh( ()=>{
      const newMesh = SkeletonUtils.clone( meshFound );
      if(Array.isArray(newMesh.material)){
        console.log('updateMaterial...' , newMesh.material )
        newMesh.material= newMesh.material.map( mat =>{
          var newMat =  mat.clone();
          console.log(newMat )
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
          {/*
          <div>{property.events ? property.events[currentEventIndex].summary : null }</div>
          */}
          <div>{property.time}</div>
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
