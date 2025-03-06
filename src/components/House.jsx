import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Vector2  } from 'three';
import { useModel } from '../contexts/modelContext';
import { HouseMaterial } from '../shaders/houseMaterial';

export default function House(props){
  const modelContext = useModel();
  const [mesh, setMesh] = useState();
  const [materials, setMaterials] = useState();
  const [property, setProperty] = useState({ name:'house_01', x:0,y:0, mapUDIMs: [0,0] } );


  useEffect(()=>{
    setProperty(_props=>({..._props, ...props.property}))
  },[props.property])

  useEffect(()=>{
    if ( modelContext ) {
      updateMesh();
    }
  },[ modelContext , property ])


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
    return <mesh position ={[property.x, 0, property.y]} onPointerOver={()=>{onMouseOver(true)}} onPointerOut={()=>{onMouseOver(false)}} onClick={()=>{props.onClick()}}>
        <primitive object={mesh}  material={materials}/></mesh>
  }


}



