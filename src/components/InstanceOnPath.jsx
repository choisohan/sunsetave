import React, {useRef , useMemo, useEffect , useState } from 'react'
import {  CatmullRomCurve3 , Object3D , Vector3 , InstancedBufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { HouseMaterial } from '../shaders/houseMaterial';
import { useTexture } from '../contexts/modelContext';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';


const counts = {
    "car": 5, "bus":1 , "truck": 0
}
export const LoadInstanceAlongPath = ({meshPath, lineGeometry, offset =.0 }) =>{
    const _fbxFile = useLoader(FBXLoader, meshPath); 
    const [objects, setObjects] = useState([]);
    const textureContext = useTexture();
    const curve = useMemo(() => {

        const pos = lineGeometry.attributes.position;
        const points = [];
        for (let i = 0; i < pos.count; i++) {
          points.push(new Vector3().fromBufferAttribute(pos, i));
        }
        return new CatmullRomCurve3(points);
      }, [lineGeometry]);



    useEffect(()=>{
        if(!textureContext) return;
        const replaceMaterial = mat =>{
            const material = HouseMaterial();
            material.defines.USE_INSTANCING ='';
            material.uniforms.uMap.value = mat.map; 
            material.uniforms.uSkyColorMap.value = textureContext['env/skyColormap'] ;
    
            if(mat.name.includes("glass")){
                material.uniforms.uIsWindow.value =true;
                delete material.defines.USE_MAP;
            }
            material.needsUpdate = true;
    
            return material ;
        }
        
        const _objects =[] ; 
        _fbxFile.traverse( child =>{
            if(!child.isMesh) return;
            var material = child.material;
            if(Array.isArray(material)){
                material = material.map( replaceMaterial )
            }
            else{
                material = replaceMaterial(material)
            }

            _objects.push(<InstanceOnPath mesh={child.geometry.clone()}
                material = {material}
                name ={child.name}
                maxCount={counts[child.name]}
                curve={curve}
                offset={offset}
                key={_objects.length}
                />
            )
        })
        setObjects(_objects);
    },[_fbxFile , curve , textureContext , offset  ])






    return <>{objects}</>
}

export default function InstanceOnPath({ name,  curve , mesh, material,  maxCount = 10 ,speed=.05, offset=0.0    }) {

    const meshRef = useRef();
    const progressRef = useRef(new Array(maxCount).fill(0).map((_, i) => ((i / maxCount)+(offset*0.35))%1.  ));
    const timestamp = useTimestamp();

    useEffect(()=>{
        if(name === "car"){
            const tileIndex = new Float32Array(maxCount);
            for (let i = 0; i < maxCount; i++) {
                tileIndex[i] = Math.floor( (Math.random())*5) /5. ;
              }
    
            meshRef.current.geometry.setAttribute(
              'tileIndex',
              new InstancedBufferAttribute(tileIndex, 1)
            );
        }
    } ,[maxCount , name ] )

    useEffect(()=>{
        meshRef.current.material.forEach(mat=>{
            mat.uniforms.uTime.value= timestampToHourFloat(timestamp)
        })
    },[timestamp])


    useFrame((_, delta) => {
        const dummy = new Object3D();

        progressRef.current = progressRef.current.map(p => {
            let next = p + delta * speed; 
            return next > 1 ? next - 1 : next; // loop
        });

        progressRef.current.forEach((t, i) => {
            const point = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);
            dummy.position.copy(point);
            dummy.up.set(0, 0 , 1); 
            dummy.lookAt(point.clone().add(tangent));
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (<instancedMesh ref={meshRef} args={ [mesh, material ,maxCount]} />)
    

}

