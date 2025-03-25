import {  RawShaderMaterial } from "three";
import {  useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";


export const OceanMaterial = (SkyColorMap, time ) => {
    
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

            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
            vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
            vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;


            float riffleAmount = 1. ; 
            float horizon = sin( vViewDir.z * riffleAmount )  ; 
            horizon = floor( horizon * 3. )/3. ;
            horizon *=.25; 
            horizon += 1.- distance(.1, vViewDir.x*.1);

           horizon = step(.8, horizon);

           vec3 highlight = mix( skyColorBottom, cloudHighlight,vViewDir.y);
           vec3 baseColor =  mix( skyColorMiddle, cloudShadow,vViewDir.y);
           vec3 color = mix(baseColor , highlight , horizon ) ;

            gl_FragColor= vec4(color, 1. ) ;


        }
        `,
        transparent: false, 
        uniforms:{
            uSkyColorMap : {value: SkyColorMap },
            uTime : { value : time  }, //define sky color and move the cloud
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
})}