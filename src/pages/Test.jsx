import { Canvas } from '@react-three/fiber'
import React from 'react'
import { OrbitControls } from '@react-three/drei'
import TerrainMesh from '../components/TerrainMesh'
import { CapsuleGeometry, RawShaderMaterial, SphereGeometry } from 'three'


export default function Test() {


    return (
    <div><Canvas style={{width:'100vw', height:'100vh'}}  camera={{position: [15,15,15], fov: 20}} >
        <OrbitControls />
        <ReflectedMesh />
       
    </Canvas></div>
    )
}



const ReflectedMesh = ()=>{

    const reflectionMaterial = new RawShaderMaterial({
        vertexShader:`
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;    
            attribute vec3 position;
            attribute vec2 uv;
            attribute vec3 normal;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            varying vec3 vPosition;


            void main() {

                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                gl_Position = projectedPosition;
                
                vNormal = normalize(mat3(viewMatrix) * normal);

                
                vViewDir =normalize(-viewPosition.xyz);
                vPosition = position; 

            }
      `,
        fragmentShader:`
            precision mediump float;
            varying vec3 vNormal;
            varying vec3 vViewDir;
            varying vec3 vPosition;


            float Fresnel(){
                return dot(vNormal, vViewDir);
            }

            float DiagonalLine(float _scale){


                float pattern ; 
                pattern = gl_FragCoord.x + gl_FragCoord.y;
                pattern += dot(vNormal, vViewDir)*100.;
                pattern =  mod(pattern, 500.0 * _scale ); 

                pattern = step(500.0 * _scale *.75 , pattern); // Makes it binary (black & white);
                return pattern;

            }

            void main() {

                float glassRefelction = smoothstep(0.5,0.55 , Fresnel());
                glassRefelction += DiagonalLine(.5); 
                glassRefelction= normalize(glassRefelction);
                

                vec3 color = mix(vec3(0.0), vec3(1.0),  glassRefelction ); // Black & white
                //color = vViewDir; 
                gl_FragColor = vec4(color,1. );
            }
        `
    })

    return <>
    <mesh material={reflectionMaterial} position={[0,0,0]}>
        <capsuleGeometry args={[.5, 1, 2, 20]} /> 
    </mesh>
    <mesh material={reflectionMaterial} position={[1.2,0,0]}>
        <boxGeometry args={[1, 1, 1]} /> 
    </mesh>
    </>

}




