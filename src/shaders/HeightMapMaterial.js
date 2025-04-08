import {  RawShaderMaterial, Vector2  } from 'three';


export const HeightMapMaterial = ()=>  new RawShaderMaterial({
    vertexShader: `
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
    uniform sampler2D uHeightMap; 
    uniform float uHeightScale;



    void main()
    {

        float height = texture2D( uHeightMap , uv ).x;
        vec3 displacedPosition = position + normal * height * uHeightScale;

        vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
        vNormal = normalize( normal ); 
        vNormal2 = normalize(mat3(viewMatrix) * normal);

        vPosition = gl_Position.xyz; 
        vViewDir =normalize(-viewPosition.xyz);

    }`,
    fragmentShader:`
    precision mediump float;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vNormal2;
      varying vec3 vViewDir;
      uniform sampler2D uHeightMap; 
      uniform sampler2D uSkyColorMap; 
      uniform float uTime; 

    void main(){  
        float height = texture2D( uHeightMap , vUv ).x;
        vec3 color = vec3(.5,.545,.5265); 
       // color = vec3(.0, height,height);



        vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;
        color*= cloudHighlight; 
        gl_FragColor= vec4(color,1. );
    }
    `,uniforms:{
        uSkyColorMap: {value : null},
        uTime: {value: .5 },
        uHeightMap:{value: null },
        uHeightScale: {value:.5}
    },
    //wireframe:true
})