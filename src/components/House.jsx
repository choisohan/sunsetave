import React, { useEffect, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { RawShaderMaterial, Vector2 , DoubleSide } from 'three';

export const House =(props) => {


  const [model, setModel] = useState(null);

  useEffect(()=>{
    if ( props.models ) {

      // Find Geometry By Name
      props.models.traverse((child) => {
          const i =  parseInt(child.name.match(/-?\d+\.?\d*/g)) 
          if ( child.isMesh && i == props.geo) {
            const clone =  SkeletonUtils.clone(child); 

            // Set Position
            clone.position.x = props.position.x;
            clone.position.y = props.position.y; 
            clone.position.z = props.position.z; 

            // Replace Materials
            clone.material= clone.material.map( ( mat, i) =>{
              return rawMaterial(mat.map, props.UDIM[i] ); 
            })


            setModel( clone )
          }
      });
    }


  },[props])


  if(model){
    return <primitive object={model} />
  }


}



const rawMaterial =(map,x)=> new RawShaderMaterial({
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;    
  attribute vec3 position;
  
  attribute vec2 uv;
  varying vec2 vUv;

  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      vUv = uv;
  }
  `,
  fragmentShader: `
    precision mediump float;
    varying vec2 vUv;

    uniform sampler2D uTexture; 
    uniform vec2 uUDIM; 

  void main(){
    // Create a local copy of vUv to modify
    vec2 modifiedUv = vUv;
    modifiedUv.x += 0.1* uUDIM.x ; // adjust as needed

     gl_FragColor = vec4( texture2D( uTexture , modifiedUv).xyz, 1.);
  }
  `,
  uniforms:{
      uTexture: { value: map },
      uUDIM : {value: new Vector2(x) }

  },transparent: false, // This disables transparency
  side: DoubleSide // Optional: Render both sides
})