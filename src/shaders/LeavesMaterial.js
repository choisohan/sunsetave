import React from 'react'
import { Color, RawShaderMaterial, Vector2 } from 'three'
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function LeavesMaterial() {

    const skyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');;
    const perlinNoiseMap = useLoader(TextureLoader, '/textures/common/PerlinNoise.png');;
    const perlinNoiseNormalMap = useLoader(TextureLoader, '/textures/common/PerlinNoiseNormal.png');;


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
        uniform vec2 uMapRepeat;


        uniform sampler2D uPerlinNoiseNormal; 
        uniform mat3 normalMatrix; // Built-in in WebGL
        varying vec3 vWorldNormal;
        uniform float uNormalStrength; 

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


            //Apply Normal map
            vec3 normalMap = texture2D( uPerlinNoiseNormal, uv * uMapRepeat ).xyz * 2. -1. ;
            normalMap.xy *= uNormalStrength;
            normalMap.z = sqrt(1.0 - clamp(dot(normalMap.xy, normalMap.xy), 0.0, 1.0)); // Re-normalize Z


            vWorldNormal = normalize( (normalMatrix * normal) + normalMap) ;
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
        uniform sampler2D uPerlinNoise; 
        uniform sampler2D uPerlinNoiseNormal; 
        varying vec3 vWorldNormal;

        uniform float uTime; 
        uniform vec3 uColor; 
            

        void main(){

            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;

            vec3 diffuseMap = texture2D( uMap, vUv ).xyz;

            vec3 diffuse = diffuseMap;
            //diffuse *= cloudHighlight; 


            
            float highlight = dot(vWorldNormal, vec3( -0.4 , 1., -.1 )  );
            highlight= step(.25, highlight); 

            vec3 color = uColor * cloudHighlight ;
            color += highlight * skyColorBottom *.5 ; 
            
            float fresnel =  dot(vWorldNormal, ( vec3(.0,.0,1.) ));
            fresnel = step(0.85 , fresnel);
            gl_FragColor= vec4(color, fresnel  ) ;


        }
    
    `,
    uniforms:{
        uMap :{value: null},
        uPerlinNoise:{value: perlinNoiseMap},
        uPerlinNoiseNormal:{value: perlinNoiseNormalMap},
        uSkyColorMap:{value: skyColorMap},
        uTime:{value: 0.5},
        uNormalStrength: {value: .15 },
        uMapRepeat : {value: new Vector2(.5 ,.5 )},
        uColor:{value: new Color(0x619434)} ,
        uWindStrength: {value: .5}

    },
    transparent:true

})}
