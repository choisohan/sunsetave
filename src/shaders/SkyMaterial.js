import { BackSide, RawShaderMaterial } from "three";

export const SkyMaterial =  (  )=>{
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

            vPosition = modelPosition.xyz; 
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



        float CloudScale(float skyRamp){
            float ramp = smoothstep( 1.0, 0. ,  (skyRamp * 4. ) - .1  ); 

            vec2 offset;
            offset.x -=  uTimestamp;
            vec2 uv =  fract( (vUv ) + offset );
            float noise =  texture2D( uPerlinNoiseMap, uv).x;
            noise = sin(noise + uTimestamp ); 
            float result  = ramp- noise ; 
            result = smoothstep(-.5,.5 ,  result );
            return  result;
        }

        vec2 Clouds( float x, float y , float scale , float skyRamp){
            vec2 offset; 
            offset.x +=  uTimestamp; 
            offset.y = y; 

            vec2 uv = (vUv + offset) * scale  ;
            uv += texture2D( uPerlinNoiseMap, fract(uv)  ).x  *.05; //Distortion

            uv.x += sin(floor(  uv.y  * 5. ));// *.1;
            uv = fract(uv ); 


            vec4 map = texture2D( uCloudMap,   uv );
            float shaded = dot( vec3( 0.0,1.0,.0 ) , map.xyz );

            shaded =  step( .25, shaded) *.5 +  smoothstep( .0, .6, shaded )*1.5;
            map.a *=  CloudScale(skyRamp) ;
            map.a *= 1.- step(skyRamp,.0 ); 
            map.a = step( .5, map.a ); // cloudAlpha


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

            // Base Color
            float skyRamp = step(.45,vUv.y) * distance(.45, vUv.y);

            float bottomMask =smoothstep(0.0,1. ,(skyRamp * 10. )-.1 ); 
            color = mix( skyColorBottom, skyColorMiddle , bottomMask ) ; 
            float topMask = smoothstep(0.0,1. ,(skyRamp * 10. )-.25 ); 
            color = mix( color, skyColorTop , topMask ) ; 


            vec2 clouds1 = Clouds( .0 ,.0 , uCloudScale , skyRamp);
            vec2 clouds2 = Clouds( .0 , 0. , uCloudScale*.79  , skyRamp);

            vec2 cloudsMixed = mix(clouds1, clouds2, clouds2.y);

            vec3 cloudColored = mix(cloudShadow, cloudHighlight, cloudsMixed.x );
            color =  mix(color, cloudColored, cloudsMixed.y);




            gl_FragColor= vec4( color , 1. );





            
        }
        `,
        side:BackSide,
        uniforms:{
            uCloudMap : {value: null},
            uCloudScale : {value: 5 }, 
            uSkyHeight :{value: 0.18 },
            uSkyColorMap : {value: null },
            uPerlinNoiseMap : {value: null  },
            uTime : { value : 0.7}, //define sky color and move the cloud
            uTimestamp: {value: 0 },
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
    })
}