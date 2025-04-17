import { RawShaderMaterial, Vector2 } from 'three'

export default function BasicMaterial() {
   
    return new RawShaderMaterial({
    vertexShader:`

        attribute mat4 instanceMatrix;
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

        uniform mat3 normalMatrix; // Built-in in WebGL

        void main()
        {
            mat4 instance = mat4(1.0); // default: identity
            #ifdef USE_INSTANCING
                instance = instanceMatrix;
            #endif
            vec4 modelPosition = modelMatrix * instance *  vec4(position, 1.0)  ;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;

            vNormal =  normalMatrix * normal;//mat3(viewMatrix) * normal ; //normalize(mat3(viewMatrix) * normal);

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

            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
            vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
            vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;



            vec2 uv = fract(vUv * uMapRepeat); 
            vec3 diffuseMap = texture2D( uMap, uv ).xyz;
            diffuseMap = pow(diffuseMap, vec3(.7)); 

            vec3 color = vNormal;
            #ifdef USE_MAP
                color = diffuseMap;
            #endif

            float diffuseValue = smoothstep(  1., .0 , distance(diffuseMap.xyz, vec3( 1. ))); 
            float specMask =  dot( vNormal, normalize(vec3( .25 , 1. ,  -.25 ) ));
            specMask +=  diffuseValue *.1  ; 
            specMask = sin(.9 + specMask*6. )*.5+.5; 
            specMask= smoothstep(.5, 1.  ,specMask); 

           
           color *=  min( vec3(1.) , cloudHighlight+vec3(.15 )  );

           gl_FragColor= vec4(color, 1. );

        }
    
    `,
    uniforms:{
        uMap :{value: null},
        uMapRepeat:{value: new Vector2(1.)},
        uSkyColorMap:{value: null },
        uTime:{value: 0.0}

    },
    defines: {
      //  USE_INSTANCING: '',
        USE_MAP:''
    },
})}
