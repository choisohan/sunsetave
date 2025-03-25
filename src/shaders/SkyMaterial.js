import { BackSide, RawShaderMaterial } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";


export const SkyMaterial =  (SkyColorMap, time )=>{
    const CloudsMap = useLoader(TextureLoader, '/textures/env/clouds.png');
    //const SkyColorMap = useSkyColorMap(); //useLoader(TextureLoader, '/textures/env/skyColormap.png');
    /*
    const [time,setTime] = useState(0);

    useFrame (()=>{
        setTime(x => (x + .1)%1.)
    })
        */

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
        uniform float uTime; 

        void main(){ 

            vec3 color;

            // 1. Vertically Ramp Sky
            
            vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
            vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
            vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
            vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;


            vec2 uv = vUv *2. ; // vPosition.xy *vec2(.005);


            color = mix(skyColorBottom, skyColorMiddle , smoothstep(.0, 0.1 , vUv.y) ) ; 
            color = mix( color , skyColorTop , smoothstep(.1, 1. , vUv.y) ) ;  


            // 2. Draw Cloud
            vec2 rotatingUV = fract(  uv * vec2(1. ,2.) * 2.   + vec2(uTime *-.1 , 0.0)  )     ;
            vec4 cloudMap = texture2D( uCloudMap,   rotatingUV );
            float cloudShaded = dot( vec3( 0.0,1.0,.0 ) , cloudMap.xyz );
            float cloudAlpha =  cloudMap.a * smoothstep(.0, 0.5 , uv.y) ; // step(.5, cloudMap.a) ;
            cloudAlpha = step(.5, cloudAlpha ); 

            vec3 cloudColored = mix( cloudShadow , cloudHighlight, step(.5,cloudShaded));
            color = mix(color, cloudColored , cloudAlpha);

            gl_FragColor= vec4(color, 1. ) ;

            
        }
        `,
        side:BackSide,
        uniforms:{
            uCloudMap : {value: CloudsMap},
            uSkyColorMap : {value: SkyColorMap },
            uTime : { value : time  }, //define sky color and move the cloud
            uCloudiness: {value : 0. },  // desaturate the color of sky
            uSeason : {value : .5 } //eg. 0 = spring, .25 = summer, .5 = fall, .75 = weather
        }
    })
}