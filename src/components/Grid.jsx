import React, { useEffect, useRef, useState } from 'react'
import { GridMaterial } from '../shaders/GridMaterial';


export const Grid=(props)=>{

    const [meshes,setMeshes] = useState(props.meshes || []);
    const grpRef = useRef();

    useEffect(()=>{
        setMeshes(props.meshes)
    },[props.meshes])

    const onMouseEnter = (evt,i, isHover)=>{
       // console.log( i)
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