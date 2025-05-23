import React, { useEffect, useRef, useState } from 'react'
import { useLoader } from "@react-three/fiber";
import { FBXLoader, SkeletonUtils } from "three/examples/jsm/Addons.js";
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
    const [objects, setObjects] = useState([])



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


        _fbxFile.traverse(_child =>{
            const child = SkeletonUtils.clone(_child);

            if(_child.isMesh){

                if(_child.parent.name === "grid"){ 
                    _grids.push(_child);
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
            else if(_child.isLine){
                _objects.push(
                    {lineGeometry:child.geometry , offset: _objects.length/3 }
                )
                //<LoadInstanceAlongPath timeDiff={props.timeDiff} meshPath="/models/commuters.fbx" key={_objects.length} lineGeometry={child.geometry} offset={_objects.length/3} />)
            }
            

        })

        setGrids(_grids)
        setGeos(_geos)
        setObjects(_objects)

        if(!props.setGrids) return; 
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
        var _timestamp = timestamp;
        if(props.timeDiff) _timestamp -= props.timeDiff;
        
        const uTime =  timestampToHourFloat(_timestamp , tz ); 
        materials.forEach(mat=>{
            mat.uniforms.uTime.value =uTime;
        })

    },[ timestamp , materials , timezoneOverride , props.timeDiff ])


    useFrame((state, delta)=>{
        timeRef.current += delta; // delta is time in seconds since last frame
        materials.forEach(mat=>{
            if( !mat.uniforms.uFrame )return; 
            mat.uniforms.uFrame.value = timeRef.current; 
        })
    })

    return <>

    <group rotation={[-Math.PI / 2, 0, 0]} >
    {geos}

    {objects.map((obj,i) =>(
        <LoadInstanceAlongPath timeDiff={props.timeDiff} meshPath="/models/commuters.fbx" key={i} lineGeometry={obj.lineGeometry} offset={obj.offset} />
    ))}

    <Grid meshes={grids}
            onClick={ (x)=>{if(props.onClick) props.onClick(x)}}
            onMouseEnter={x=>{
                if(props.onEnterNewCell)props.onEnterNewCell(x)}}
            editMode={props.editMode}/>
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
        mat.uniforms.uMap.value = map;
        _mat = mat; 
    }
    else{
        _mat = BasicMaterial();
        if(map){
            _mat.uniforms.uMap.value = map;
            _mat.uniforms.uMapRepeat.value = map.repeat; 
        }

    }

   // setMaterials(arr=> ([...arr, _mat]))
    return _mat;
}


