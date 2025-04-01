import React, { useEffect, useRef, useState } from 'react'
import { Box3, Color, Group, MathUtils, Mesh, MeshBasicMaterial, ShapeGeometry, TextureLoader, Vector2, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'
import { useLoader } from "@react-three/fiber";

import { HeightMapMaterial } from '../shaders/HeightMapMaterial';
import { GridMaterial } from '../shaders/GridMaterial';

export default function SVGTerrain(props) {


    const heightMap = useLoader(TextureLoader, '/textures/terrains/A/Height.png' )
    const gridMap = useLoader(SVGLoader, '/textures/terrains/A/Grid.svg' )

    const meshRef = useRef();
    const [cellArray, setCellArray] = useState([])
    const [gridScale, setGridScale] = useState(1);



    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')


   useEffect(()=>{
    canvas.width =1024;
    canvas.height = 1024;
    document.body.appendChild(canvas)

   },[])

    useEffect(()=>{
        if(!meshRef.current || !heightMap ) return;

        ctx.drawImage( heightMap.image,  0, 0, 1024, 1024 );
        console.log('DRAW IMAGE')
        const material = HeightMapMaterial();
        material.uniforms.uHeightMap.value = heightMap; 
        meshRef.current.material = material;
        material.uniforms.uHeightScale.value=.1;
        material.wireframe = true; 

    },[heightMap])

    useEffect(()=>{
        if(!gridMap || !heightMap ) return; 
        const _cellArr = [];
        var _scale = 1; 

        gridMap.paths.forEach((path, i )  =>{

            if(i === 0 ){  //Get Canvas Size
                const grp = new Group();

                path.toShapes().forEach(s =>{
                    const geo = new ShapeGeometry(s);
                    const mat = new MeshBasicMaterial();
                    const mesh = new Mesh(geo, mat)
                    grp.add(mesh)
                })

                const box = new Box3().setFromObject(grp);
                const center = box.getCenter(new Vector3());
                _scale = center.x*2;
            }

            else{

                const transform = getTransformFromPath(path.currentPath, _scale);
                const valueFromHeightMap = GetValueFromImage(transform.position.x,transform.position.y)
                transform.position.z = valueFromHeightMap ;

                path.toShapes().forEach(s =>{
                    _cellArr.push({shape: s, transform: transform });
                })
            }

        })
        
        setCellArray(_cellArr)
        setGridScale(_scale);

        props.onCellUpdate(_cellArr.filter( _cell => _cell.transform ));

    },[gridMap , heightMap ])



    const onCellClick = selected =>{
       console.log( selected )
    }


    const getTransformFromPath = ( path, _scale ) => {


        const v1 = path.curves[0].v1;
        const v2 = path.curves[0].v2;
        const v3 = path.curves[1].v2; // v2 of the second curve
        const v4 = path.curves[2].v2; // v2 of the third curve
    
    
        const dir = v2.clone().sub(v1); // v2-v1
        const angle = Math.atan2(dir.y, dir.x)
        const rotation = new Vector3(0,MathUtils.radToDeg(angle), 0)
    
        const centerPosition = new Vector3(
            (v1.x + v2.x + v3.x + v4.x) / 4,
            (v1.y + v2.y + v3.y + v4.y) / 4,
            0 // Assuming 2D shape (no Z-axis consideration)
        );
    
        centerPosition.x = (centerPosition.x)/_scale;
        centerPosition.y = (centerPosition.y)/_scale;

    
        return {position: centerPosition, rotation : rotation }
    
    }

    const GetValueFromImage = ( uvX , uvY )=>{
        let x = Math.floor( uvX * 1024  );
        let y = Math.floor( uvY * 1024 );
        let pixelData = ctx.getImageData(x,y, 1, 1).data;
       return pixelData[0]/255; // return only red Color
    }
    
    

    return (
    <group>

    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} >
        <planeGeometry args={[1, 1, 20, 20]} />
    </mesh>

    <group rotation={[-Math.PI / 2, 0, 0]} position={[0,.01,0]} >
        {cellArray.map((cell, i ) =>
            <mesh  key={i} material={ new MeshBasicMaterial( {color:new Color().setRGB(cell.transform.position.z,cell.transform.position.z,cell.transform.position.z )} )} onClick={()=>{onCellClick(cell.transform)}} position={[-.5,-.5,cell.transform.position.z*.1]} scale={1/gridScale}   >
                <shapeGeometry args={[cell.shape]} />
            </mesh>
        )}
    </group>


    </group>)}


