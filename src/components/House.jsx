import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { useModel , useTexture } from '../contexts/modelContext';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import moment from 'moment-timezone';


const NormalizedCurrentTime = ( timezone )=>{
  const currentMoment = moment().tz(timezone)
  const minutesOfDay = currentMoment.hour() * 60 + currentMoment.minute();
  return  minutesOfDay / 1440;
}

export default function House(props){
  const modelContext = useModel();
  const TextureContext = useTexture(); 
  const [mesh, setMesh] = useState();
  const [property, setProperty] = useState({
    name:'house_A1', x:0,y:0, roof:'R1', windows:'W1', wall: 'W1',  time: 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  } );




  useEffect(()=>{
    setProperty(_props =>{
        const normTime = NormalizedCurrentTime(props.property.timezone).toFixed(2) ;
        return {..._props, ...props.property , time: parseFloat(normTime)}}
    )
  },[props.property])

  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();

    }
  },[ modelContext , TextureContext , property ])



  //Tempoary Timelapse
  useFrame(()=>{
    if(mesh && mesh.material){
      mesh.material.forEach( mat =>{
        mat.uniforms.uTime.value = .01 + mat.uniforms.uTime.value ;
      })
    }
  })

  const updateMap = (_mat) =>{
    if(_mat.name in property){
      const texturefullName = _mat.name + '/'+ property[_mat.name]
      _mat.uniforms.uMap.value =TextureContext[texturefullName]
      _mat.uniforms.uTime.value= property.time
    }
  }


  function updateMesh(){

    var meshFound = modelContext[property.name]; 
    if(!meshFound){
      meshFound = Object.values(modelContext)[0]
    }

    setMesh( ()=>{
      const newMesh =   SkeletonUtils.clone( meshFound );
      
      if(Array.isArray(newMesh.material)){
        newMesh.material.forEach( mat =>updateMap(mat))
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

        <Html position={[0, 1, 0]} center>
          <div>Hello</div>
        </Html>
        
        </mesh>
  }


}



