import { BackSide, RawShaderMaterial } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader ,NearestFilter } from "three";

export const SkyMaterial =  ( SkyColorMap )=>{
    const CloudsMap = useLoader(TextureLoader, '/textures/env/clouds.png');
    CloudsMap.minFilter= NearestFilter;
    
    const PerlinNoiseMap = useLoader(TextureLoader, '/textures/common/PerlinNoise.png');

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
            vViewDir =normalize(-viewPosition.xyz);

        }
        `,
        fragmentShader:`
        precision mediump float;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        uniform sampler2D uCloudMap; 
        uniform sampler2D uSkyColorMap; 
        uniform sampler2D uPerlinNoiseMap; 

        uniform float uTime; 
        uniform float uTimestamp; 

        uniform float uCloudScale; 
        uniform float uSkyHeight; 


        float SkyRamp(float _uSkyHeight, float _blend ){
            return 1.-  smoothstep(_uSkyHeight - _blend,  _uSkyHeight  , distance(.5, vUv.y) * 2. );

        }

        float CloudScale(){
            vec2 offset;
            offset.x -=  uTimestamp/100000000.;
            vec2 uv =  fract( (vUv ) + offset );
            float noise =  texture2D( uPerlinNoiseMap, uv).x;
            noise = sin(noise + uTimestamp/100000000. ); 
            float ramp = SkyRamp( uSkyHeight+.2  , .3);
            float result  = ramp- noise ; 
              result = smoothstep(-.5,.5 ,  result );
            return  result;
        }

        vec2 Clouds( float x, float y ){
            vec2 offset; 
            offset.x +=  uTimestamp/100000000.; 
            offset.y = y; 
            vec2 rotatingUV =  fract(vUv * vec2(uCloudScale) + offset )  ;
            vec4 map = texture2D( uCloudMap,   rotatingUV );
            float shaded = dot( vec3( 0.0,1.0,.0 ) , map.xyz );
            return vec2(shaded , map.a);
        }


        void main(){ 
            // 1. Vertically Ramp Sky
            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
            vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
            vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;


            vec3 color;
            float skyRamp = SkyRamp( uSkyHeight , .3 ) ; 
            color = mix(skyColorBottom, skyColorMiddle , skyRamp ) ; 
            color = mix( color , skyColorTop , smoothstep(.1 , 1. , vUv.y) ) ;   


            vec2 clouds1 = Clouds( .0 ,.0);
            vec2 clouds2 = Clouds( .73 , .33 );

            vec2 cloudsMixed = mix(clouds1, clouds2, (clouds2.y) );
            cloudsMixed.x =  step( .25, cloudsMixed.x ) *.5 +  smoothstep( .0, .6, cloudsMixed.x )*1.5;
           // cloudsMixed.x -=  step( .2, -cloudsMixed.x )*.25; // shaded

            cloudsMixed.y *=  CloudScale() ;
            cloudsMixed.y = step( .5, cloudsMixed.y ); // cloudAlpha


            vec3 cloudColored = mix(cloudShadow, cloudHighlight, cloudsMixed.x );
            color =  mix(color, cloudColored, cloudsMixed.y);


            gl_FragColor= vec4( color , 1. );

            //gl_FragColor = vec4( vec3(CloudScale() ), 1. );


            
        }
        `,
        side:BackSide,
        uniforms:{
            uCloudMap : {value: CloudsMap},
            uCloudScale : {value: 5 }, 
            uSkyHeight :{value: 0.18 },
            uSkyColorMap : {value: SkyColorMap },
            uPerlinNoiseMap : {value: PerlinNoiseMap },
            uTime : { value : 0.7}, //define sky color and move the cloud
            uTimestamp: {value: 0 },
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
    })
}