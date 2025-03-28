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
      uniform sampler2D uSkyColorMap; 
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

  
      vec4 phong(vec4 diffuseMap) {
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

          
          
          
          if(uMouseOver){
            diffuseMap.xyz =diffuseMap.xyz *.9 + vec3(.0, .1, .2);
          }

          if (diffuseMap.a < 0.5) discard; // Cutout effect
          return vec4( diffuseMap.rgb * lighting , 1. ); ;
      }

  

      float GetStrengthByTime( int iPeakHour, int iBlendingHours ){ 
        float fPeakTime = float(iPeakHour)/24.;
        float fPeakBlend = float(iBlendingHours)/24.;

        float str = 1.-( distance( uTime,fPeakTime ) );
        str = smoothstep( 1.- fPeakBlend, 1. , str );
        return str; 
      }


      void main(){  
          vec4 diffuseMap = texture2D( uMap , (vUv) );
          gl_FragColor= phong(diffuseMap) ;

          if(uIsWindow){
              float glassMask =  step(diffuseMap.x + diffuseMap.y + diffuseMap.z ,.0 );

              // Add IndoorLight
              vec3 indoorLight = vec3(1., .5,.2);
              float indoorLightStrength = GetStrengthByTime(18, 3);
              gl_FragColor.xyz = mix(gl_FragColor.xyz, indoorLight * indoorLightStrength ,glassMask);

              //Add Reflection
              float reflectionMask = step(.25, Fresnel()) + DiagonalLine(.5) * 20. ;
              vec3 skyColorBottom = texture2D( uSkyColorMap, vec2( 0.0/5. +.1,fract(uTime)) ).xyz;
              vec3 skyColorMiddle = texture2D( uSkyColorMap, vec2( 1.0/5.+.1 , fract(uTime)) ).xyz;
              vec3 skyColorTop = texture2D( uSkyColorMap, vec2( 2.0/5. +.1, fract(uTime) ) ).xyz;
              vec3 cloudShadow = texture2D( uSkyColorMap, vec2( 3.0/5. +.1, fract(uTime) ) ).xyz;
              vec3 cloudHighlight = texture2D( uSkyColorMap, vec2( 4.0/5. +.1, fract(uTime) ) ).xyz;


              
              vec3 reflectCol = mix( skyColorMiddle, skyColorBottom , reflectionMask); 
              float reflecStr = GetStrengthByTime(12, 6);
              reflecStr = smoothstep(.0, .1 , reflecStr); 
              gl_FragColor.xyz = mix(  gl_FragColor.xyz  , reflectCol  , glassMask* reflecStr);

          
          }




      }
      `,
      uniforms:{
          uMap: { value: null },
          uSkyColorMap:{ value: null },
          uUDIM : {value: new Vector2(0.) },
          uMouseOver: { value : false },
          uIsWindow:{value: false}, 
          uTime: { value : 0.5 } //24 * 60 = 1440
      },
      transparent: true, 
  })