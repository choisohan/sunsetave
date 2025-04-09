import * as THREE from "three";
import { useEffect, useMemo, useState } from "react";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useTimestamp, useUpdateTimestamp } from "../contexts/envContext"
import { timestampToHourFloat } from "./Clock";
import StreetLineMaterial from "../shaders/StreetLineMaterial";



export default function StrokeMesh ({ path }){

    const timestamp = useTimestamp();
    const [material, setMaterial ] = useState(StreetLineMaterial());

    useEffect(()=>{
        material.uniforms.uTime.value = timestampToHourFloat(timestamp, null );
    },[timestamp] )

    const strokeMeshes = useMemo(()=>{
        let renderOrder = 1;
        return path.subPaths.map((subPath) => {
                const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                if (!geometry) return null;

                return (
                    <mesh key={renderOrder++} geometry={geometry} material={material} renderOrder={renderOrder} />
                );
            })


    },[path])

    return <group>{strokeMeshes}</group>;
};

