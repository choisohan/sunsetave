import React, { useEffect, useRef, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Vector2  } from 'three';
import { useModel } from '../contexts/modelContext';
import { HouseMaterial } from '../shaders/houseMaterial';

export default function House(props){
  const modelContext = useModel();
  const [mesh, setMesh] = useState();
  const [materials, setMaterials] = useState();
  const [property, setProperty] = useState({ name:'house_01', position : [0,0,0] , mapUDIMs: [0,0] } );


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
              //_mat.needsUpdate();
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


  function onClick(){
    console.log('A house is clicked')
  }

  // Render
  if(mesh){
    return <primitive object={mesh} position ={property.position} material={materials}
                      onPointerOver={()=>{onMouseOver(true)}} onPointerOut={()=>{onMouseOver(false)}} onClick={onClick}
                      />
  }


}



