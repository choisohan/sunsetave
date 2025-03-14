import { DoubleSide, RawShaderMaterial, Vector2 , Vector4 } from 'three';


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
    varying vec3 vPosition;
  
    void main()
    {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
        vNormal = normalize( normal ); 
        vPosition = gl_Position.xyz; 
    }
    `,
  
    fragmentShader: `
      precision mediump float;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
  
      uniform sampler2D uMap; 
      uniform sampler2D uPaperMap; 
      uniform vec2 uUDIM; 
      uniform bool uMouseOver; 
      uniform float uTime; 
    #define PI 3.1415926538

  
      vec4 phong() {
          float time = fract(uTime);
          float angle =  (time-.5)  *PI *2. ;

          vec3 LightDirection = vec3( sin(angle), 0.0, cos(angle));
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

          
          vec4 diffuseMap = texture2D( uMap , fract(vUv) );//.xyz *.75 +.25 ;
          
          if(uMouseOver){
            diffuseMap.xyz =diffuseMap.xyz *.9 + vec3(.0, .1, .2);
          }
          float paperMap = texture2D( uPaperMap , fract(vUv) ).x *.66+.33 ;
  
          return vec4( diffuseMap.rgb * lighting * paperMap, diffuseMap.a); ;
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
          uTime: { value : 0.5 } //24 * 60 = 1440
      },
    //  transparent: true, 
   //   depthWrite:true,
    //  depthTest: true,
   //   side: DoubleSide,

      
  })