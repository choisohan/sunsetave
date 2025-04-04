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
import { useThree } from '@react-three/fiber';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';


export default function House(props){
  const { gl } = useThree(); 
  const modelContext = useHouseModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [currentEventIndex, setCurrentEventIndex] = useState(null)
  const [property, setProperty] = useState({});
  const [isHovered, setIsHovered] = useState(false); 
  const meshRef = useRef();
  const [meshHeight, setMeshHeight] = useState(0);
  const timestamp = useTimestamp();
  const [updateTime, setUpdateTime]  = useState( true|| props.updateTime )



  useEffect(()=>{
    if( props.property.id !==property.id ){
      FindCalendar(props.property.id).then( calendar =>{

        const timeoffset = GetTimestampOffset(calendar.timezone);
        setProperty(_property =>(
          {..._property, ...props.property , ...calendar , timeoffset : timeoffset }
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
    var section = _mat.name.replace('_mat','');
    var texturefullName; 
    if(section in property){
      texturefullName = section + '/'+ property[section]
    }
    else{
      texturefullName = section + '/1'
    }
    _mat.uniforms.uMap.value =TextureContext[texturefullName];
    _mat.uniforms.uSkyColorMap.value =TextureContext['env/skyColormap'];
  }

  useEffect(()=>{
    if(!mesh || !updateTime) return;

    if( Array.isArray(mesh.material) ){
      mesh.material.forEach( _mat=>{
        _mat.uniforms.uTime.value= timestampToHourFloat(timestamp + property.timeoffset);
      })
    }else{
      mesh.material.uniforms.uTime.value= timestampToHourFloat(timestamp + property.timeoffset);
    }


  },[timestamp])

  function updateMesh(){

    var meshFound = modelContext[property.mesh]; 
    if(!meshFound){
      meshFound = Object.values(modelContext)[0]
      const bbox = new Box3().setFromObject(meshFound);
      const size = new Vector3();
      bbox.getSize(size);
      setMeshHeight(size.y * 0.65  );
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

  const audioRef = useRef()
  useEffect(()=>{
    gl.domElement.style.cursor = isHovered ? 'pointer': 'default'; 
    if(isHovered && audioRef.current ){
      audioRef.current.volume = .2;
      audioRef.current.play().catch(err=>{
      })

    }

  },[isHovered])
   
//rotation={[-Math.PI / 2, 0, 0]}  

  // Render
  if(! mesh ) return; 

  return <mesh ref={meshRef} 
  position ={ property.position ? [property.position.x, property.position.y, property.position.z] :   [0,0,0] }
  rotation = {property.rotation ? [0, property.rotation.z,0] :   [0,0,0] }
              onPointerEnter={()=>{setIsHovered(true)}}
              onPointerOut={()=>{setIsHovered(false)}}
              onClick={()=>{props.onClick(property)}}>

      <primitive object={mesh} scale={[.75,.75,.75] } />
          <EventStateBubble content={ property.events ? property.events[currentEventIndex].summary :'' } height={meshHeight} />
          <Html>
            <audio ref={audioRef} src="/audios/jump.wav" />
          </Html>
      </mesh>



  


}

const EventStateBubble = (props)=>{
  return <Html zIndexRange={[0, 1]} style={{ transform: "none" }} position={[0, props.height , -0.25]} center style={{
    background:'white', padding: '5px' , transform: 'translate(-50%,calc(-100% - 10px))', zIndex:1
    }}>
    {props.content}
    </Html>
}


const GetTimestampOffset = (tz) => {
  return moment.tz(tz).utcOffset()  * 60 * 1000 ; 
};


const FindCalendar = async(_id)=>{
  var cal; 
  if(_id.includes('sample&&')){
    _id = _id.split('sample&&')[1];
    cal = await SampleCalendars[_id]
  }else{
    cal =  await fetchCalendar(_id);
  }
  return await SortCalendarData(cal);
}


