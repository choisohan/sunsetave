import { BackSide, RawShaderMaterial } from "three";


export const SkyMaterial =  ()=>{
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
varying vec3 vNormal2;

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
    vViewDir =normalize(-viewPosition.xyz);

}
        `,
        fragmentShader:`
        precision mediump float;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        vec3 rampSky(){
            vec3 topColor = vec3(0.031,0.286,0.741);
            vec3 bottomColor =  vec3(0.557, 1.0, 0.984);

            float ramp =  smoothstep(.0, 500.  , vPosition.y );
            return mix( bottomColor, topColor, ramp );
        }
        void main(){ 
            gl_FragColor= vec4(rampSky() , 1. ) ;
        }
        `,
        side:BackSide
    })
}