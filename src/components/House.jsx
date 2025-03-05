import React, { useEffect, useState } from 'react'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { RawShaderMaterial, Vector2 ,Vector3, Vector4, DoubleSide, SphereGeometry , meshStandardMaterial} from 'three';

export const House =(props) => {


  const [model, setModel] = useState(null);

  useEffect(()=>{
    if ( props.models ) {

      // Find Geometry By Name
      props.models.traverse((child) => {
          const i =  parseInt(child.name.match(/-?\d+\.?\d*/g)) 
          if ( child.isMesh && i == props.geo) {
            var clone =  SkeletonUtils.clone(child); 
            
            // Set Position
            clone.position.x = props.position.x;
            clone.position.y = props.position.y; 
            clone.position.z = props.position.z; 

            // Replace Materials
            clone.material= clone.material.map( ( mat, i) =>{
              return HouseMaterial(mat.map, props.UDIM[i] ); 
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



export const HouseMaterial = (map, x)=>  new RawShaderMaterial({
  vertexShader: `
  uniform mat4 projectionMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelMatrix;    
  attribute vec3 position;
  
  attribute vec2 uv;
  varying vec2 vUv;

  attribute vec3 normal;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      vUv = uv;
      vNormal = normalize( normal ); 
      vPosition = gl_Position.xyz; 
  }
  `,

  fragmentShader: `
    precision mediump float;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;

    uniform sampler2D uTexture; 
    uniform vec2 uUDIM; 

    uniform vec4 LightPosition;


    vec3 phong(vec2 _UV) {
        vec3 n = normalize(vNormal);
        vec3 s = normalize(vec3(LightPosition) - vPosition);
        vec3 v = normalize(vec3(-vPosition));
        vec3 r = reflect(-s, n);

        float lighting = dot(s, n) ; 
        lighting = smoothstep( 0.0 , 1.0, lighting ) +.5;
        lighting= clamp(0., 1., lighting  );
        vec3 diffuseMap = texture2D( uTexture , _UV).xyz ;

        return diffuseMap * lighting;
    }

      void main(){
          // Create a local copy of vUv to modify
          vec2 modifiedUv = vUv;
          modifiedUv.x += 0.1* uUDIM.x ; // adjust as needed

          gl_FragColor= vec4( phong(modifiedUv) ,1.);
      }
    `,
    uniforms:{
        uTexture: { value: map },
        uUDIM : {value: new Vector2(x) },
        LightPosition: { value: new Vector4(-500,-500,500, -0) },
    },
    //transparent: false, 
    //side: DoubleSide 
})