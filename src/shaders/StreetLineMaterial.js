import { RawShaderMaterial } from 'three'
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function StreetLineMaterial() {

    const skyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');;
    const RoadMap = useLoader(TextureLoader, '/textures/terrains/tiles/Road.png');;
    const heightMap = useLoader(TextureLoader, '/textures/terrains/A/Height.png' )

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
        uniform sampler2D uHeightMap; 
        uniform float uHeightScale; 


        void main()
        {
            vec2 pos = -(position.xy);
            pos = fract(pos * vec2(1./245. ));
            float height  = texture2D(uHeightMap, pos ).x;

            vec3 displacedPosition = position + normal * height * uHeightScale;

            vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;
            vNormal = normalize( normal ); 

            vPosition = (position.xyz); 
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
        uniform sampler2D uHeightMap; 
        uniform float uTime; 


        void main(){

            vec2 pos = -(vPosition.xy);
             pos = fract(pos * vec2(1./245. ));
            float height  = texture2D(uHeightMap,pos).x;

           vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;
        
            vec3 color = texture2D(uMap,vUv.yx* vec2(1., 3.)).xyz;
            color *= cloudHighlight; 


            gl_FragColor= vec4(color, 1. ) ;

        }
    
    `,
    uniforms:{
        uSkyColorMap: {value : skyColorMap},
        uMap : {value: RoadMap},
        uHeightMap :{value : heightMap},
        uHeightScale: {value: 60.},
        uTime: {value: .5 }
        
    },
    //wireframe: true
   depthTest: false

})}
