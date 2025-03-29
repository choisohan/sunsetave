import React, { useEffect, useRef, useState } from 'react'
import { Vector2 , Color , RawShaderMaterial, MeshBasicMaterial, FrontSide } from 'three'
import { useThree } from '@react-three/fiber'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { GridMaterial } from '../shaders/GridMaterial';
import { OceanMaterial } from '../shaders/WaterMaterial';
import { useSkyColorMap , useTimestamp  } from '../contexts/envContext';
import BasicMaterial from '../shaders/BasicMaterial';
import { timestampToHourFloat } from './Clock';
import { NearestFilter } from 'three';

export default function TerrainMesh(props){
    const _fbxFile = useLoader(FBXLoader, '/models/terrain_A.fbx'); 

    const {camera, raycaster} = useThree();
    const [selectedCell, setSelectedCell] = useState();

    const [gridMesh, setGridMesh] = useState();
    const skyColorMap = useSkyColorMap();
    const timestamp = useTimestamp();

    const [materials, setMaterials] = useState([]); 


    useEffect(()=>{
        materials.forEach(mat=>{
            mat.uniforms.uTime.value = timestampToHourFloat(timestamp); 
        })
    },[timestamp])

    useEffect(()=>{

        _fbxFile.traverse(child =>{

            if(child.name === 'grid'){
                setGridMesh(child);
                child.visible = props.editMode;
                props.onGridUpdate(child);
            }
            else if(child.parent.name === 'grid'){
                child.material =   GridMaterial();
            }
            else if(child.isMesh && child.parent.name != 'grid'){

                if(child.name.includes('water')){
                    child.material = OceanMaterial(skyColorMap, timestamp)
                    child.material.uniforms.uTime.value = timestampToHourFloat(timestamp); 
                    setMaterials(arr =>[...arr, child.material ]);
                }
                else{
                    if(child.material.map){
                        const map = child.material.map;                        
                        child.material = BasicMaterial();
                        child.material.uniforms.uMap.value = map;
                        child.material.uniforms.uTime.value = timestampToHourFloat(timestamp); 
                        map.minFilter= NearestFilter;
                        setMaterials(arr =>[...arr, child.material ]);
                    }                  
                }
            }
        })
    },[_fbxFile])

    useEffect(()=>{
        if(gridMesh){
            gridMesh.visible= props.editMode;
        }
    },[props.editMode])



    const OnMouseOver = (evt)=>{
        if(!props.editMode || !gridMesh) return;

        var mouse = new Vector2();
        var intersects;
        mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObject(gridMesh);

        if(!intersects[0])return
        const object = intersects[0].object;
        props.onMouseMoveOnGrid( parseInt( object.name.split('_')[1] ));

        if(!object) return; 
        object.material.uniforms.uMouseOver.value = true; 

        
        if(selectedCell && selectedCell!=object){
            selectedCell.material.uniforms.uMouseOver.value = false; 
        }
           
        setSelectedCell(object);
        
         
    }

    const OnMouseDown = e =>{
        if(!props.editMode) return;
        props.onComplete();
    }



    if(_fbxFile){
        return <mesh onPointerMove={OnMouseOver} onPointerDown={OnMouseDown}> 
            <primitive object={_fbxFile}/>
        </mesh>
    }

}