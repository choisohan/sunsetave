import {  RawShaderMaterial } from "three";
import {  useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";


export const OceanMaterial = () => {
    
    const SkyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');

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
        uniform float uTime; 

        void main(){
            vec3 color = vec3(.0);


            float horizon = 1.- distance(.0, vViewDir.x*.1) ;
            color = mix(vec3(.0) ,vec3(1.), horizon ) ;
            gl_FragColor= vec4(color, 1. ) ;

        }
        `,
        transparent: false, 
        uniforms:{
            uSkyColorMap : {value: SkyColorMap},
            uTime : { value : .5 }, //define sky color and move the cloud
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
})}