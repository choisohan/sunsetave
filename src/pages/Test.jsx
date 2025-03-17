import { Canvas } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { Vector2 , Vector3, Color , BufferAttribute, MeshBasicMaterial, RawShaderMaterial } from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";

export default function Test() {


    return (
    <div><Canvas style={{width:'100vw', height:'100vh'}}  camera={{position: [15,15,15], fov: 20}} >
        <OrbitControls />
        <TerrainGeometry />
       
    </Canvas></div>
    )
}






const createVertexColorAttribute = (geometry)=>{
    const count = geometry.attributes.position.count; 
    const colors = new Float32Array(count * 3); 

    for (let i = 0; i < count; i++) {
        colors[i * 3] = 1; 
        colors[i * 3 + 1] = 1; 
        colors[i * 3 + 2] = 1; 
    }

    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    geometry.attributes.color.needsUpdate = true;

}



const FaceHoverGeometry = ()=>{

    const {scene,camera, raycaster} = useThree();
    const meshRef = useRef();
    const [selectedFaceIndex, setSelectedFaceIndex]= useState(); 


    useEffect (()=>{
        if (!meshRef.current) return;
        createVertexColorAttribute(meshRef.current.geometry);

    },[])


    const OnMouseOver = e=>{
        var mouse = new Vector2();
        var intersects;
        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObject(meshRef.current);

        if (intersects.length === 0) return;

        const colorAttribute = meshRef.current.geometry.attributes.color;
    
        if(colorAttribute){


            const previousFaceIndex = selectedFaceIndex; 

            if(previousFaceIndex){
                //previous
                var [pv1,pv2,pv3] = GetVertexIndex(meshRef.current.geometry, previousFaceIndex );
                colorAttribute.setXYZ(pv1, 1, 1, 1);
                colorAttribute.setXYZ(pv2, 1, 1, 1);
                colorAttribute.setXYZ(pv3, 1, 1, 1);
            }

            const faceIndex = intersects[0].faceIndex ; 
            const [v1,v2,v3] = GetVertexIndex(meshRef.current.geometry, faceIndex );
            colorAttribute.setXYZ(v1, 0, 0, 0);
            colorAttribute.setXYZ(v2, 1, 0, 0);
            colorAttribute.setXYZ(v3, 1, 0, 0);

            setSelectedFaceIndex(faceIndex)
            colorAttribute.needsUpdate = true; // Update colors

        }
    }

    const GetVertexIndex = (geometry, faceIndex)=>{
        const index = geometry.index; // The index buffer (Uint16Array or Uint32Array)
        const v1 = index.getX(faceIndex * 3);
        const v2 = index.getX(faceIndex * 3 + 1);
        const v3 = index.getX(faceIndex * 3 + 2);
        return [v1, v2, v3]
    }


    return (
    <mesh ref={meshRef} onPointerMove={OnMouseOver}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial vertexColors   />
    </mesh>)
}







const TerrainGeometry = ()=>{
    const {camera, raycaster} = useThree();
    const [mesh, setMesh] = useState();
    const _fbxFile = useLoader(FBXLoader, '/models/terrain.fbx'); 
    const [selectedObject, setSelctedObject] = useState();

    const meshRef = useRef();


    useEffect(()=>{
        _fbxFile.traverse(child =>{
            if(child.isMesh){
              //  createVertexColorAttribute(child.geometry);
                child.material = new MeshBasicMaterial({ color:'white' });

            }
        })

        setMesh(_fbxFile);

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
        object.material.color.set('blue');

        if(selectedObject && selectedObject!=object) selectedObject.material.color.set('white');

        setSelctedObject(object);
    }



    if(mesh){
        return <mesh ref ={meshRef} onPointerMove={OnMouseOver}> 
            <primitive object={mesh}/>
        </mesh>
    }

}