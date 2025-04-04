import React from 'react'
import { RawShaderMaterial, Vector2 } from 'three'

export default function BasicMaterial() {
   
    return new RawShaderMaterial({
    vertexShader:`
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;    
        attribute vec3 position;

        attribute vec2 uv;
        varying vec2 vUv;

        attribute vec3 normal;
        varying vec3 vNormal;

        varying vec3 vPosition;
        varying vec3 vViewDir;


        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;
            vNormal = normalize( normal ); 

            vPosition = gl_Position.xyz; 
            vViewDir =(-viewPosition.xyz);
        }
    `,
    
    fragmentShader:`
        precision mediump float;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        uniform sampler2D uSkyColorMap; 
        uniform sampler2D uMap; 
        uniform vec2 uMapRepeat; 

        uniform float uTime; 

        void main(){

            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;

            vec2 uv = fract(vUv * uMapRepeat); 
            vec3 diffuseMap = texture2D( uMap, uv ).xyz;

            vec3 diffuse = diffuseMap;
            diffuse *= cloudHighlight; 
            vec3 color = diffuse ;
            gl_FragColor= vec4(color, 1. ) ;

        }
    
    `,
    uniforms:{
        uMap :{value: null},
        uMapRepeat:{value: new Vector2(1.)},
        uSkyColorMap:{value: null },
        uTime:{value: 0.5}

    }

})}
