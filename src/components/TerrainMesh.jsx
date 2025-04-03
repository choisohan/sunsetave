import React, { useEffect, useRef, useState } from 'react'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { GridMaterial } from '../shaders/GridMaterial';
import {  useTimestamp  } from '../contexts/envContext';
import BasicMaterial from '../shaders/BasicMaterial';
import { timestampToHourFloat } from './Clock';
import { Euler, MathUtils, NearestFilter, Quaternion, Vector3 } from 'three';






export default function TerrainMesh(props){

    const _fbxFile = useLoader(FBXLoader, '/models/town_A.fbx'); 
    const timestamp = useTimestamp();
    const [grids, setGrids] = useState([]);


    useEffect(()=>{
        const time =  timestampToHourFloat(timestamp); 
        _fbxFile.traverse(child=>{
            if(!child.isMesh) return; 

            if(child.parent.name === "geo"){
                child.material.forEach(material => {
                    if(material.uniforms?.uTime){
                        material.uniforms.uTime.value =time;

                    }
                });
            }
        })

    },[timestamp])


    useEffect(()=>{
        if( grids.length > 0 ) return; 
        const _grids= [];

        _fbxFile.traverse(child =>{
            if(!child.isMesh){
                //child.rotation.x = 0;            
                return;
            }
            if(child.parent.name === "grid"){ 
                _grids.push(child);
            }

            else{
                child.material = child.material.map(_mat=>{
                    if(_mat.map){
                        const map = _mat.map;
                        map.minFilter = NearestFilter; 
                        _mat = BasicMaterial();
                        _mat.uniforms.uMap.value = map;
                    }
                    return _mat;
                })
            }
        })

        setGrids(_grids)




        props.setGrids(_grids.map(cellObject=>{

            const newPosition = new Vector3();
            cellObject.getWorldPosition(newPosition);

            const newRotation = new Euler();
            const quaternion = new Quaternion();
            cellObject.getWorldQuaternion(quaternion);
        
            newRotation.setFromQuaternion(quaternion, "XYZ")
            return {position:newPosition, rotation:newRotation}
        }))

    },[_fbxFile])


    return <>
    <mesh> 
        <primitive object={_fbxFile}/>
    </mesh>

    <group rotation={[-Math.PI / 2, 0, 0]} >
    <Grid meshes={grids} onClick={props.onClick} onMouseEnter={props.onMouseEnter} editMode={props.editMode}/>
    </group>

 </>

}






const Grid=(props)=>{

    const [meshes,setMeshes] = useState(props.meshes || []);
    const grpRef = useRef();
    useEffect(()=>{
        setMeshes(props.meshes)
    },[props.meshes])

    const onMouseEnter = (evt,i, isHover)=>{
        const object = evt.object;
        if(!object.material.uniforms) return; 
        object.material.uniforms.uMouseOver.value = isHover; 

        if(isHover){
            props.onMouseEnter(i)
        }
    }

    useEffect(()=>{
        if(grpRef.current){
            grpRef.current.visible= props.editMode;
        }
    },[props.editMode])

    return <group ref={grpRef}>
    {meshes.map((item,i)=>
        <mesh key = {i} onPointerEnter={e=>{onMouseEnter(e,i, true)}}
                        onPointerLeave={e=>{onMouseEnter(e,i, false)}}
                        onClick={e=>{props.onClick(i); console.log( e.object )}}> 
            <primitive object={item} material={GridMaterial()}/>
        </mesh>
    )}
    </group>
    
       
}