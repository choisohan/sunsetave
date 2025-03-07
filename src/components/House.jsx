import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Vector2  } from 'three';
import { useModel } from '../contexts/modelContext';
import { HouseMaterial } from '../shaders/houseMaterial';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';


export default function House(props){
  const modelContext = useModel();
  const [mesh, setMesh] = useState();
  const [materials, setMaterials] = useState();
  const [property, setProperty] = useState({ name:'house_01', x:0,y:0, mapUDIMs: [0,0] , time: 0 } );


  useEffect(()=>{
    setProperty(_props=>({..._props, ...props.property}))
  },[props.property])

  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();
    }
  },[ modelContext , property ])



  //Tempoary Timelapse
  useFrame(()=>{
    if(materials){
      materials.forEach( mat =>{
        mat.uniforms.uTime.value = .01 + mat.uniforms.uTime.value ;
      })
    }
  })



  function updateMesh(){

      const meshSearchByName = modelContext.children.filter(c => c.name == property.name ); 
      setMesh( ()=>{
        const clonedMesh =  SkeletonUtils.clone( meshSearchByName[0]);

        if(clonedMesh.material){

          const _materials = clonedMesh.material.map( (mat,i) =>{
              const _mat = HouseMaterial(); 
              _mat.uniforms.uMap.value = mat.map;
              _mat.uniforms.uPaperMap.value = mat.specularMap;
              _mat.uniforms.uUDIM.value = new Vector2( property.mapUDIMs[i] , 0.0 );
              _mat.uniforms.uTime.value = property.time;
              return _mat; 
          })
          setMaterials(_materials);


        }

        return clonedMesh
      })
    
  }

  function onMouseOver(_isMouseOver){
    setMaterials ( _mats=>
      _mats.map(mat => {
        mat.uniforms.uMouseOver.value = _isMouseOver;
        mat.needsUpdate = true;  
        return mat 
      }
    ))

  }


  // Render
  if(mesh){
    return <mesh position ={[property.x, 0, property.y]}
                onPointerOver={()=>{onMouseOver(true)}}
                onPointerOut={()=>{onMouseOver(false)}}
                onClick={()=>{props.onClick()}}>

        <primitive object={mesh}  material={materials}/>

        <Html position={[0, 1, 0]} center>
          <div>Hello</div>
        </Html>
        
        </mesh>
  }


}



