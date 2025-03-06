import { RawShaderMaterial, Vector2 , Vector4 } from 'three';


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
  
      uniform vec4 LightPosition;
  
  
      vec3 phong(vec2 _UV) {
          vec3 n = normalize(vNormal);
          vec3 s = normalize(vec3(LightPosition) - vPosition);
          vec3 v = normalize(vec3(-vPosition));
          vec3 r = reflect(-s, n);
  
          float lighting = dot(s, n) ; 
          lighting = smoothstep( 0.0 , 1.0, lighting ) +.5;
          lighting= clamp(0., 1., lighting  );
          vec3 diffuseMap = texture2D( uMap , _UV).xyz ;
          if(uMouseOver){
            diffuseMap +=vec3(.33);
          }
          float paperMap = texture2D( uPaperMap , fract(vUv  * 10. ) ).x ;
  
          return diffuseMap * lighting * paperMap ;
      }
  
        void main(){
            // Create a local copy of vUv to modify
            vec2 modifiedUv = vUv;
            modifiedUv.x += 0.1* uUDIM.x ; // adjust as needed
  
            gl_FragColor= vec4( phong(modifiedUv) ,1.);
        }
      `,
      uniforms:{
          uMap: { value: null },
          uPaperMap : {value : null } ,
          uUDIM : {value: new Vector2(0.) },
          LightPosition: { value: new Vector4(-500,-500,500, -0) },
          uMouseOver: { value : false }
      },
      //transparent: false, 
      //side: DoubleSide 
  })