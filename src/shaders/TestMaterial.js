import { RawShaderMaterial } from 'three'
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function TestMaterial() {

    const skyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');;
    
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

            vPosition = normalize(position.xyz); 
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


        void main(){


            vec3 color = vec3(vUv, .0 ); 

            gl_FragColor= vec4(color, 1. ) ;

        }
    
    `,
    uniforms:{
        uMap:{value: null},
    }

})}
