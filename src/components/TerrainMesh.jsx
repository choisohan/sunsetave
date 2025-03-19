import React, { useEffect, useRef, useState } from 'react'
import { Vector2 , Color , RawShaderMaterial } from 'three'
import { useThree } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";


export default function TerrainMesh(props){
    const {camera, raycaster} = useThree();
    const [mesh, setMesh] = useState();
    const _fbxFile = useLoader(FBXLoader, '/models/terrain.fbx'); 
    const [selectedObject, setSelctedObject] = useState();

    const meshRef = useRef();


    useEffect(()=>{
        _fbxFile.traverse(child =>{
            if(child.isMesh){
                //child.material = new MeshBasicMaterial({ color:'white' });

                const material = new RawShaderMaterial({
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
                    
                    gl_FragColor = vec4(c, 1.0);
                    }
                                        
                    
                    `,
                    uniforms:{
                        uThickness :{value: .05},
                        uMouseOver : {value : false},
                        uMouseOverColor : {value : new Color(.2,.5,.9)}
                    }})

                child.material = material; 


            }
        })

        setMesh(_fbxFile);
        props.onMeshUpdate(_fbxFile);

    },[_fbxFile])



    const OnMouseOver = (evt)=>{
        var mouse = new Vector2();
        var intersects;
        mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObject(meshRef.current);

        if(!intersects[0])return

        const object = intersects[0].object;
        
        if(!object) return; 
        object.material.uniforms.uMouseOver.value = true; 

        if(selectedObject && selectedObject!=object){
            selectedObject.material.uniforms.uMouseOver.value = false; 
        }


        setSelctedObject(object);
    }

    const OnMouseDown = e =>{
        console.log(  selectedObject.position.x )
    }



    if(mesh){
        return <mesh ref ={meshRef} onPointerMove={OnMouseOver} onPointerDown={OnMouseDown}> 
            <primitive object={mesh}/>
        </mesh>
    }

}