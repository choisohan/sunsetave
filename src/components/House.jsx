import React, { useEffect, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Vector2  } from 'three';
import { useModel } from '../contexts/modelContext';
import { HouseMaterial } from '../shaders/houseMaterial';

export default function House(props){
  const modelContext = useModel();
  const [mesh, setMesh] = useState();
  const [material,setMaterial] = useState();
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
          setMaterial(()=>{
            return clonedMesh.material.map( (mat,i) =>{
              const _mat = HouseMaterial(); 
              _mat.uniforms.uMap.value = mat.map;
              _mat.uniforms.uPaperMap.value = mat.specularMap;
              _mat.uniforms.uUDIM.value = new Vector2( property.mapUDIMs[i] , 0.0 );
              return _mat;
            })
          })
        }

        return clonedMesh
      })
    
  }

  // Render
  if(mesh){
    return <primitive object={mesh} position ={property.position} material={material} />
  }


}



