import {  RawShaderMaterial, Vector2  } from 'three';


export const HouseMaterial = ()=>  new RawShaderMaterial({
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

  
    void main()
    {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
        vNormal = normalize( normal ); 
        vNormal2 = normalize(mat3(viewMatrix) * normal);; 

        vPosition = gl_Position.xyz; 
        vViewDir =normalize(-viewPosition.xyz);

    }
    `,
  
    fragmentShader: `
      precision mediump float;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vNormal2;
      varying vec3 vViewDir;

  
      uniform sampler2D uMap; 
      uniform sampler2D uPaperMap; 
      uniform vec2 uUDIM; 
      uniform bool uMouseOver; 
      uniform bool uIsWindow; 
      uniform float uTime; 
      #define PI 3.1415926538

      float Fresnel(){
          return dot(vNormal2, vViewDir);
      }


      float DiagonalLine(float _scale){


        float pattern ; 
        pattern = gl_FragCoord.x + gl_FragCoord.y;
        pattern += dot(vNormal2, vViewDir)*100.;
        pattern =  mod(pattern, 500.0 * _scale ); 

        pattern = step(500.0 * _scale *.75 , pattern); // Makes it binary (black & white);
        return pattern;

    }

  
      vec4 phong() {
          float time = fract(uTime);
          float angle =  (time-.5)  *PI *2. ;

          vec3 LightDirection = vec3( sin(angle), 0.33, cos(angle));
          vec3 LightPosition = LightDirection * 10000000. ;

          vec3 n = normalize(vNormal);
          vec3 s = normalize( vec3( LightPosition ) - vPosition);
          vec3 v = normalize(vec3(-vPosition));
          vec3 r = reflect(-s, n);
  


          float dayTime= abs(sin(time* PI));

          float dotResult = dot(s, n); 
          dotResult = smoothstep(   0.  , 1. , dotResult + dayTime);

        
          vec3 lightColor = mix( vec3(1.25,0.65,0.4) ,vec3(1.12) , smoothstep(0.5,1. , dayTime) );
          
          vec3 shadedColor = mix( vec3(0.,0., .0), vec3(0.5,0.6, .75) , dayTime ) ;

          vec3 lighting =mix(  shadedColor , lightColor , dotResult);

          
          vec4 diffuseMap = texture2D( uMap , (vUv) );//.xyz *.75 +.25 ;
          
          if(uMouseOver){
            diffuseMap.xyz =diffuseMap.xyz *.9 + vec3(.0, .1, .2);
          }
          float paperMap = texture2D( uPaperMap , (vUv) ).x *.66+.33 ;


          if(uIsWindow){

            float frameMask = step(.9,  diffuseMap.x  );
            paperMap = mix(  1. , paperMap ,frameMask) ; 
            lighting = mix( vec3( 1. ) ,lighting , frameMask) ; 


            vec3 indoorLight  = mix( vec3(1.) * diffuseMap.xyz ,
                              vec3(1., .22 , .0) * (1.-diffuseMap.xyz) ,
                              smoothstep(.1, .0, distance(uTime, .8))  );


            indoorLight *= smoothstep(.09, 0.1 , distance( abs(uTime), 1. ));

            diffuseMap.xyz  = mix( indoorLight,  diffuseMap.xyz , frameMask );
            
            float reflectionMask = step(.25, Fresnel()) + DiagonalLine(.5) * 20. ;
            reflectionMask *= 1.- frameMask ;
            reflectionMask = smoothstep(.0, 1.0, reflectionMask);

            float reflectAmount =   smoothstep(.2, 0.1, distance(uTime, .6) );

            vec3 blueSkyColor =  vec3( 0.65, .9 , .9);
            vec3 sunsetSkyColor = vec3(1. , .0 , 0.0);

            float mixSkyColor =  smoothstep(.2 , 0.1 , distance(uTime , .55 ) );
            vec3 reflectedColor =   mix( sunsetSkyColor ,blueSkyColor,  mixSkyColor )  ; 

            reflectedColor = mix(  reflectedColor, vec3(.5) + diffuseMap.xyz, smoothstep(0.9, .95 , 1.- distance(.5,  fract( uTime + .5 ) ) ));

            diffuseMap.xyz = mix( diffuseMap.xyz , reflectedColor , reflectionMask ); 
            //diffuseMap.xyz  = reflectedColor;
          }

          if (diffuseMap.a < 0.5) discard; // Cutout effect
          return vec4( diffuseMap.rgb * lighting , 1. ); ;

  
      }
  
        void main(){  
            gl_FragColor= phong() ;
        }
      `,
      uniforms:{
        
          uMap: { value: null },
          uPaperMap : {value : null } ,
          uUDIM : {value: new Vector2(0.) },
          uMouseOver: { value : false },
          uIsWindow:{value: false}, 
          uTime: { value : 0.5 } //24 * 60 = 1440
      },
      transparent: true, 
  })