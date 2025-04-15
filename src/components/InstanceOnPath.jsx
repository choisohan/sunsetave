import React, {useRef , useMemo, useEffect , useState } from 'react'
import {  CatmullRomCurve3 , Object3D , Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { HouseMaterial } from '../shaders/houseMaterial';
import BasicMaterial from '../shaders/BasicMaterial';


export const LoadInstanceAlongPath = ({meshPath, lineGeometry}) =>{
    const _fbxFile = useLoader(FBXLoader, meshPath); 
    const [objects, setObjects] = useState([]);

    useEffect(()=>{
        const _objects =[] ; 
        _fbxFile.traverse( child =>{
            if(!child.isMesh) return;
            const material =  HouseMaterial(); 
            material.defines.USE_INSTANCING ='';
            delete material.defines.USE_MAP;
           material.needsUpdate = true;


            const item = <InstanceOnPath mesh={ child.geometry} material = {material} curve={curve} key={_objects.length}/>
            _objects.push(item)
        })
        setObjects(_objects);
    },[_fbxFile])




    const curve = useMemo(() => {
        const pos = lineGeometry.attributes.position;
        const points = [];
        for (let i = 0; i < pos.count; i++) {
          points.push(new Vector3().fromBufferAttribute(pos, i));
        }
        return new CatmullRomCurve3(points);
      }, [lineGeometry]);



    return <>{objects}</>
}

export default function InstanceOnPath({ curve , mesh, material,  maxCount = 10 }) {
    const meshRef = useRef();
    const progressRef = useRef(new Array(maxCount).fill(0).map((_, i) => i / maxCount));


    useFrame((_, delta) => {
    const dummy = new Object3D();

    progressRef.current = progressRef.current.map(p => {
        let next = p + delta * 0.1; // speed
        return next > 1 ? next - 1 : next; // loop
    });

    progressRef.current.forEach((t, i) => {
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        dummy.position.copy(point);

        // Optional: orient toward the curve direction
        dummy.lookAt(point.clone().add(tangent));
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (<instancedMesh ref={meshRef} args={ [mesh, material ,maxCount]} />)
    

}

