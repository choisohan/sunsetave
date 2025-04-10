import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useHouseModel , useTexture } from '../contexts/modelContext';
import { useFrame } from '@react-three/fiber';
import { getCurrentEventIndex  } from '../calendar/SortEvents';
import {FindCalendar} from '../calendar/FetchCalendar'
import { Vector3 , Box3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import EventBubble from './EventBubble';


import moment from 'moment-timezone';

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



  useEffect(()=>{

    if( props.property.id !== property.id ){
      FindCalendar(props.property.id).then( calendar =>{
        const newProperty = {...property, ...props.property , ...calendar  }; 
        setProperty(newProperty)
        props.onUpdateProperty( newProperty );

      }).catch(err =>{
        props.onUpdateProperty();
      })
    }
    else{
      setProperty(_property =>(
        {..._property, ...props.property   }
      ))
    }
  },[ props.property ])




  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();
    }
  },[ modelContext , TextureContext , property ])


  const updateMap = (_mat) =>{
    var section = _mat.name.replace('_mat','');

    var folderName = section;
    //WallB is using WallA folder as a texture source
    if( folderName[folderName.length-1] == "B"){
      folderName= folderName.replace('B','A');
    }
    var texturefullName; 
    if(section in property){
      texturefullName = folderName + '/'+ property[section]
    }
    else{
      texturefullName = folderName + '/1'
    }
    _mat.uniforms.uMap.value =TextureContext[texturefullName];
    if( TextureContext['env/skyColormap']){
      _mat.uniforms.uSkyColorMap.value = TextureContext['env/skyColormap'];
    }
  }

  useEffect(()=>{
    if(!mesh) return;
    const time =  timestampToHourFloat( timestamp, property.timezone );

    if( Array.isArray(mesh.material) ){
      mesh.material.forEach( _mat=>{
        _mat.uniforms.uTime.value= time;
      })
    }else{
      mesh.material.uniforms.uTime.value= time;
    }

    if(property.events){
      const _currentIndex = getCurrentEventIndex( property.events ,timestamp );  
      const _currentEvent = property.events[_currentIndex];
      if( new moment().isBetween(_currentEvent.startMoment, _currentEvent.endMoment ) ) setCurrentEventIndex(_currentIndex);  
    }


  },[ timestamp, property , mesh ])

  function updateMesh(){
    const meshName =  'house_'+String( property.mesh).padStart(2,'0')
    var meshFound = modelContext[meshName]; 
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


  useEffect(()=>{
    gl.domElement.style.cursor = 'pointer'
    if(isHovered){
      gl.domElement.mouseOverItem = property.id;
    }
    else{
      if(gl.domElement.mouseOverItem == property.id){
        gl.domElement.style.cursor = ''
      }
    }
  },[isHovered])

   
  // Render
  if(! mesh || !property.events  ) return; 

  return <mesh ref={meshRef} 
  position ={ property.position ? [property.position.x, property.position.y, property.position.z] :   [0,0,0] }
  rotation = {property.rotation ? [0, property.rotation.z,0] :   [0,0,0] }
              onPointerEnter={()=>{setIsHovered(true)}}
              onPointerOut={()=>{setIsHovered(false)}}
              onClick={()=>{ props.onClick(property) }}>

      <primitive object={mesh} scale={[.75,.75,.75] } />
      <EventBubble isHovered={isHovered} position={[0, meshHeight +.5, -0.25]} event={property.events[currentEventIndex]} />
</mesh>
}



