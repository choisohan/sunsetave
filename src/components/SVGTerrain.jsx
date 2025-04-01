import React, { useEffect, useRef, useState } from 'react'
import { Box3, Color, Group, MathUtils, Mesh, MeshBasicMaterial, ShapeGeometry, TextureLoader, Vector2, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'
import { useLoader } from "@react-three/fiber";

import { HeightMapMaterial } from '../shaders/HeightMapMaterial';
import { GridMaterial } from '../shaders/GridMaterial';

export default function SVGTerrain(props) {


    const heightMap = useLoader(TextureLoader, '/textures/terrains/A/Height.png' )
    const gridMap = useLoader(SVGLoader, '/textures/terrains/A/Grid.svg' )

    const [heightScale,setHeightScale] = useState( props.heightScale || .25 );
    const [ scale, setScale] = useState(props.scale || 1 )

    const meshRef = useRef();
    const [cellArray, setCellArray] = useState([])
    const [gridScale, setGridScale] = useState(1);
    const [resolution, setResolution] = useState(1024);

    const [selectedPosition, setSelectedPosition ] = useState([0,0,0]);
    const [selectedRotation, setSelectedRotation ] = useState([0,0,0]);


    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')


   useEffect(()=>{
    canvas.width =resolution;
    canvas.height = resolution;
    document.body.appendChild(canvas)
   },[])

    useEffect(()=>{
        if(!meshRef.current || !heightMap ) return;
        ctx.drawImage( heightMap.image,  0, 0, resolution, resolution );
        const material = HeightMapMaterial();
        material.uniforms.uHeightMap.value = heightMap; 
        material.uniforms.uHeightScale.value=heightScale;
        material.wireframe = true; 
        meshRef.current.material = material;


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

                const transform = getTransformFromPath( path.currentPath, _scale );
                const valueFromHeightMap = GetValueFromImage(transform.position.x,transform.position.y)


                // World 
                transform.position.x = transform.position.x * scale - scale/2 ; 
                transform.position.z = -transform.position.y * scale   + scale/2  ;// - (transform.position.y * scale - scale/2 ); 
                transform.position.y = valueFromHeightMap * scale/4;


                path.toShapes().forEach(s =>{
                    _cellArr.push({shape: s, transform: transform });
                })
            }

        })
        
        setCellArray(_cellArr)
        setGridScale(_scale);

        props.onCellUpdate( _cellArr.map( _cell => _cell.transform ) );

    },[gridMap , heightMap ])



    const getTransformFromPath = ( path, _canvasScale ) => {


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
            0 
        );
    
        centerPosition.x  /= _canvasScale  ;
        centerPosition.y /=  _canvasScale  ;

    
        return {position: centerPosition, rotation : rotation }
    
    }



    const GetValueFromImage = ( uvX , uvY )=>{
        let x = Math.floor( uvX * resolution  );
        let y = Math.floor( uvY * resolution );
        let pixelData = ctx.getImageData(x,y, 1, 1).data;
       return pixelData[0]/255; // return only red Color
    }
    
    const onClickCell = (e, transform) =>{
        console.log ( transform.position)

        setSelectedPosition([
            transform.position.x,
            transform.position.y,
            transform.position.z
        ])
        setSelectedRotation([
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z
        ])
     }

    

    return (
<>
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={scale} >
        <planeGeometry args={[1, 1, 20, 20]} />
    </mesh>

    <group position={[0,.01,0]} >
        {cellArray.map((cell, i ) =>
            <mesh  key={i} material={
                new MeshBasicMaterial( {color:new Color('black')} )}
                onClick={(e)=>{onClickCell(e, cell.transform)}}
                position={[ -scale/2 , cell.transform.position.y , +scale/2  ]}
                rotation={[-Math.PI / 2, 0, 0]} 
                scale = { scale/gridScale }   >
                <shapeGeometry args={[cell.shape]} />
            </mesh>
        )}
    </group>

    <mesh scale={.2} material={new MeshBasicMaterial({color:'red'})} position={selectedPosition} rotation={selectedRotation}>
        <boxGeometry/>
    </mesh>




</>


)}


