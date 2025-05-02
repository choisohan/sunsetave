import { Color, RawShaderMaterial, Vector2, Vector3 } from 'three'

export default function LeavesMaterial() {

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

        uniform mat3 normalMatrix; // Built-in in WebGL
        varying vec3 vWorldNormal;
        varying vec3 vPosition2;

        uniform vec3 uPoint;


        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float dist = 1./ distance(modelPosition.xyz, uPoint);
            modelPosition.x += dist*.1;



            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;
            

            vPosition = gl_Position.xyz; 
            vViewDir =(-viewPosition.xyz);



            vNormal = normalMatrix * normal;
            vPosition2 = modelPosition.xyz; 
        }
    `,
    
    fragmentShader:`
        precision mediump float;
        varying vec3 vPosition;
        varying vec3 vPosition2;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        uniform sampler2D uMap; 
        uniform sampler2D uSkyColorMap; 
        uniform sampler2D uPerlinNoiseNormal; 

        uniform float uTime; 
        uniform float uFrame; 

        uniform float uNormalStrength; 

        uniform vec2 uMapRepeat;
        uniform vec3 uPoint;

        void main(){


            float gridSize = 20.;
            vec2 pixelatedUV = floor( fract(  vPosition.xy   *.05   )* gridSize )/gridSize; 
            pixelatedUV = fract(pixelatedUV - vec2( uFrame * .05, .0 ) ); 
            // floor(vUv * 10.)/10. ;


            vec2 uv = (vUv*4. ) - vec2( uFrame*.1, .0 ) ;
            uv = fract(uv ); 

            //Apply Normal map
            vec3 normalMap = texture2D( uPerlinNoiseNormal, uv *uMapRepeat ).xyz * 2. -1. ;
            normalMap = normalMap * .25+.75; 
            normalMap.xy *= uNormalStrength;
            normalMap.z = sqrt(1.0 - clamp(dot(normalMap.xy, normalMap.xy), 0.0, 1.0)); // Re-normalize Z
            vec3 worldNormal = normalize(vNormal  + normalMap) ;


            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;

            float fresnel = dot(worldNormal, ( vec3( .0 , .0 ,1. ) ));
            fresnel = step(.9 , fresnel);


            if (fresnel < 0.5) discard; // Cutout effect
            
            vec3 diffuseMap = texture2D( uMap,vUv ).xyz;
            vec3 color =  pow(diffuseMap ,vec3(.75));

            normalMap = texture2D( uPerlinNoiseNormal, pixelatedUV).xyz * 2. -1. ;
            normalMap.xy *= uNormalStrength;
            normalMap.z = sqrt(1.0 - clamp(dot(normalMap.xy, normalMap.xy), 0.0, 1.0)); // Re-normalize Z
            worldNormal = normalize(vNormal  + normalMap) ;

            color += skyColorBottom * worldNormal.y*.15 ; 

            float highlight = dot(worldNormal, vec3( -0.5 , 1., -.1 )  );
            highlight= step(.2, highlight); 
            color += skyColorBottom*.1 * highlight; 

            color *= cloudHighlight;
            gl_FragColor = vec4(color,1.);


        }
    
    `,
    uniforms:{
        uMap :{value: null},
        uPerlinNoiseNormal:{value: null },
        uSkyColorMap:{value: null},
        uTime:{value: 0.5},
        uFrame:{value: 0.},
        uNormalStrength: {value: .05 },
        uMapRepeat : {value: new Vector2(1.5,1.5 )},
        uWindStrength: {value: .5},
        uPoint:{value: new Vector3()}

    },
    transparent:true,
    

})


}

