import { RawShaderMaterial , Color, AdditiveBlending } from "three"


export const GridMaterial = ()=> new RawShaderMaterial({
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
        fragmentShader : `
        precision mediump float;

        varying vec2 vUv;
        uniform float uThickness;
        uniform bool uMouseOver;
        uniform vec3 uMouseOverColor; 

        //https://jsfiddle.net/prisoner849/kmau6591/
        float edgeFactor(vec2 p){
            vec2 grid = abs(fract(p - 0.5) - 0.5) / uThickness;
            return min(grid.x, grid.y);
        }
        
        void main() {
                
        float a = edgeFactor(vUv);
        a = smoothstep(.15,.35, a);
        
        vec3 color = vec3(.0,.0,.0); 
        if(uMouseOver){
            color = uMouseOverColor;
        }

        vec3 lineColor = vec3(1.,1.,1.);
        vec3 c = mix(lineColor, color , a);

        gl_FragColor = vec4(c, 1.);
        }
                            
        
        `,
        uniforms:{
            uThickness :{value: .05},
            uMouseOver : {value : false},
            uMouseOverColor : {value : new Color(.2,.5,.9)}
        },
        blending:AdditiveBlending,
        transparent:true,
        depthTest:false


    
    })