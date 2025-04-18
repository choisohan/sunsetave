import React, { useEffect, useRef, useState } from 'react'
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import {  useTimestamp, useTimezoneOverride  } from '../contexts/envContext';
import BasicMaterial from '../shaders/BasicMaterial';
import { timestampToHourFloat } from './Clock';
import { Euler, NearestFilter, Quaternion, Vector3 } from 'three';
import LeavesMaterial from '../shaders/LeavesMaterial';
import { useTexture } from '../contexts/modelContext';
import { useFrame } from '@react-three/fiber';
import { Grid } from './Grid';
import { InteractiveMesh } from './InteractiveMesh';
import {LoadInstanceAlongPath} from './InstanceOnPath';




export default function TerrainMesh(props){

    const _fbxFile = useLoader(FBXLoader, '/models/town_A.fbx'); 

    const timezoneOverride = useTimezoneOverride(); 
    const timestamp = useTimestamp();
    const [grids, setGrids] = useState([]);
    const [materials, setMaterials] = useState([]);
    const textureContext = useTexture();
    const timeRef = useRef(0);

    const [geos, setGeos] = useState([])
    const [objects, setObjects] = useState()


    useEffect(()=>{
        if(!textureContext)return;

        materials.forEach( mat=>{
            if(mat.uniforms.uPerlinNoiseNormal){
                mat.uniforms.uPerlinNoiseNormal.value = textureContext['common/perlinNoiseNormal'];
            }
            if(mat.uniforms.uSkyColorMap){
                mat.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'];
            }
        })
    },[ textureContext, materials  ])


    useEffect(()=>{

        if( grids.length > 0 ) return; 
        const _grids= [];
        const _geos = [];
        const _objects = [];


        _fbxFile.traverse(child =>{
            if(child.isMesh){
                if(child.parent.name === "grid"){ 
                    _grids.push(child);
                }
    
                else{
                    if(Array.isArray(child.material)){
                        child.material = child.material.map(ReplaceMaterial);
                        setMaterials(arr=> ( [...arr, ...child.material] ))                    
                    }
                    else{
                        child.material = ReplaceMaterial(child.material);
                        setMaterials(arr=> ( [...arr, child.material] ))
                    }
    
    
                    if(child.name ==="trees"){
                        _geos.push( <InteractiveMesh key={_geos.length } object={child}/>)
                    }else{
                        _geos.push( <mesh  key={_geos.length } ><primitive object={child} /></mesh>)
                    }
    
                }
            }
            else if(child.isLine){
                _objects.push(<LoadInstanceAlongPath meshPath="/models/commuters.fbx" key={_objects.length} lineGeometry={child.geometry} offset={_objects.length/2} />)
            }
            

        })

        setGrids(_grids)
        setGeos(_geos)
        setObjects(_objects)

        props.setGrids(_grids.map(cellObject=>{

            const newPosition = new Vector3();
            cellObject.getWorldPosition(newPosition);

            const newRotation = new Euler();
            const quaternion = new Quaternion();
            cellObject.getWorldQuaternion(quaternion);
        
            newRotation.setFromQuaternion(quaternion, "XYZ")
            return {position:newPosition, rotation:newRotation}
        }))

    },[_fbxFile  , grids.length  ,props ])

    useEffect(()=>{
        const tz = timezoneOverride || Intl.DateTimeFormat().resolvedOptions().timeZone; 
        const uTime =  timestampToHourFloat(timestamp , tz ); 
        materials.forEach(mat=>{
            mat.uniforms.uTime.value =uTime;
        })
    },[ timestamp , materials , timezoneOverride ])


    useFrame((state, delta)=>{
        timeRef.current += delta; // delta is time in seconds since last frame
        materials.forEach(mat=>{
            if( !mat.uniforms.uFrame )return; 
            mat.uniforms.uFrame.value = timeRef.current; 
        })
    })

    return <>

    <group rotation={[-Math.PI / 2, 0, 0]} >
    {geos}{objects}
    <Grid meshes={grids} onClick={props.onClick} onMouseEnter={props.onEnterNewCell} editMode={props.editMode}/>
    </group>

 </>

}









const ReplaceMaterial= _mat=>{
    
    var map;     
    if(_mat.map){
        map = _mat.map;
        map.magFilter = NearestFilter;
        map.minFilter = NearestFilter; 
    }

    if(!_mat.name.includes('_mat')) return _mat;


    if(_mat.name.includes('tree')){
        const mat =  LeavesMaterial();
        mat.uniforms.uColor.value = _mat.color; 
        _mat = mat; 
    }
    else{
        _mat = BasicMaterial();
        _mat.uniforms.uMap.value = map;
        _mat.uniforms.uMapRepeat.value = map.repeat; 
    }
   // setMaterials(arr=> ([...arr, _mat]))
    return _mat;
}


