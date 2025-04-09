import React, { useEffect, useRef, useState } from 'react'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { GridMaterial } from '../shaders/GridMaterial';
import {  useTimestamp  } from '../contexts/envContext';
import BasicMaterial from '../shaders/BasicMaterial';
import { timestampToHourFloat } from './Clock';
import { Euler, NearestFilter, Quaternion, Vector3 } from 'three';
import LeavesMaterial from '../shaders/LeavesMaterial';
import { useTexture } from '../contexts/modelContext';


import { useFrame } from '@react-three/fiber';


export default function TerrainMesh(props){

    const _fbxFile = useLoader(FBXLoader, '/models/town_A.fbx'); 
    const timestamp = useTimestamp();
    const [grids, setGrids] = useState([]);
    const [materials, setMaterials] = useState([]);
    const textureContext = useTexture();
    const timeRef = useRef(0);

    const ReplaceMaterial= _mat=>{
        const uTime =  timestampToHourFloat(timestamp, null ); 

        var map;     
        if(_mat.map){
            map = _mat.map;
            map.magFilter = NearestFilter;
            map.minFilter = NearestFilter; 
        }
    
        if(!_mat.name.includes('_mat')) return _mat;
    
    
        if(_mat.name.includes('tree')){
            _mat = LeavesMaterial();
            _mat.uniforms.uTime.value =uTime;
        }
        else{
            _mat = BasicMaterial();
            _mat.uniforms.uMap.value = map;
            _mat.uniforms.uMapRepeat.value = map.repeat; 
            _mat.uniforms.uTime.value =uTime;
        }
        setMaterials(arr=> ([...arr, _mat]))
        return _mat;
    }

    useEffect(()=>{
        materials.forEach( mat=>{
            if(mat.uniforms.uPerlinNoiseNormal){
                mat.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal'];
            }
            if(mat.uniforms.uSkyColorMap){
                console.log( mat)
                mat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'];
            }
        })
    },[ textureContext, materials ])


    useEffect(()=>{
        if( grids.length > 0 ) return; 
        const _grids= [];

        _fbxFile.traverse(child =>{
            if(!child.isMesh){
                return;
            }
            if(child.parent.name === "grid"){ 
                _grids.push(child);
            }

            else{
                if(Array.isArray(child.material)){
                    child.material = child.material.map(ReplaceMaterial);
                }
                else{
                    child.material = ReplaceMaterial(child.material);
                }
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

    useEffect(()=>{
        const uTime =  timestampToHourFloat(timestamp , null ); 
        materials.forEach(mat=>{
            mat.uniforms.uTime.value =uTime;
        })
    },[timestamp])


    useFrame((state, delta)=>{
        timeRef.current += delta; // delta is time in seconds since last frame
        materials.forEach(mat=>{
            if( !mat.uniforms.uFrame )return; 
            mat.uniforms.uFrame.value = timeRef.current; 
        })
    })

    return <>


<mesh> 
            <primitive object={_fbxFile} />
        </mesh>

    <group rotation={[-Math.PI / 2, 0, 0]} >
    <Grid meshes={grids} onClick={props.onClick} onMouseEnter={props.onEnterNewCell} editMode={props.editMode}/>
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
                        onClick={  e=>{props.onClick(i) }}> 
            <primitive object={item} material={GridMaterial()}/>
        </mesh>
    )}
    </group>
    
       
}