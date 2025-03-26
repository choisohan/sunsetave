import {  NearestFilter, RawShaderMaterial } from "three";
import {  useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";


export const OceanMaterial = ( SkyColorMap, time ) => {
    const PerlinNoiseMap =  useLoader(TextureLoader, '/textures/common/PerlinNoise.png');;
    PerlinNoiseMap.minFilter= NearestFilter;

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
        uniform sampler2D uPerlinNoiseMap; 

        uniform float uTime; 


        float Riffle(){
            vec2 coord = vUv ;
            coord.y+= (vViewDir.z*.1); 
            coord= fract(coord);
            //fract(vViewDir.xy * vec2(.25 , 1. ) *.5); 
            float result = texture2D( uPerlinNoiseMap, coord).x;
            return  result; 
        }


        void main(){

            vec3 color;

            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
            vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
            vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;


            float zDepth = vViewDir.z ; 
            zDepth= smoothstep(5.0,20., zDepth);
            color = mix( skyColorMiddle , skyColorTop, zDepth ) ; //Fill base color



            float riffleMask = Riffle();

            float highlightRamp = 1.- min(1., distance(.0, vViewDir.x) *.5) ;

            float oceanMask = riffleMask *  highlightRamp ;
            oceanMask = step(.5, oceanMask);

            color = mix(color, cloudHighlight, oceanMask); 

            gl_FragColor= vec4(color, 1. ) ;


        }
        `,
        transparent: false, 
        uniforms:{
            uPerlinNoiseMap : {value: PerlinNoiseMap}, 
            uSkyColorMap : {value: SkyColorMap },
            uTime : { value : time  }, //define sky color and move the cloud
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
})}