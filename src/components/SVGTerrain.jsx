import React, { useEffect, useRef, useState } from 'react'
import { AdditiveBlending, Box3, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, ShapeGeometry, TextureLoader, Vector2, Vector3 } from 'three'
import {  SVGLoader } from 'three/examples/jsm/Addons.js'
import { useLoader } from "@react-three/fiber";

import { HeightMapMaterial } from '../shaders/HeightMapMaterial';
import { GridMaterial } from '../shaders/GridMaterial';
import StrokeMesh from './StrokeMesh';
import { useTimestamp } from '../contexts/envContext';
import { timestampToHourFloat } from './Clock';
import { useTexture } from '../contexts/modelContext';

export default function SVGTerrain(props) {


    const heightMap = useLoader(TextureLoader, '/textures/terrains/A/Height.png' )
    const gridMap = useLoader(SVGLoader, '/textures/terrains/A/Grid.svg' )

    const [heightScale,setHeightScale] = useState( props.heightScale || .25 );
    const [ scale, setScale] = useState(props.scale || 1 )

    const meshRef = useRef();
    const gridRef = useRef();

    const [cellArray, setCellArray] = useState([])
    const [streetArray, setStreetArray] = useState([])



    const [gridScale, setGridScale] = useState(1);
    const [resolution, setResolution] = useState(1024);

    const textureContext = useTexture();

    const [editMode, setEditMode] = useState( props.editMode || true )


    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const timestamp =useTimestamp();
   useEffect(()=>{
    canvas.width =resolution;
    canvas.height = resolution;
   },[])


    useEffect(()=>{
        setEditMode(props.editMode);
        gridRef.current.visible= props.editMode;
        
    },[props.editMode])


    useEffect(()=>{
        if(!meshRef.current || !heightMap ) return;
        ctx.drawImage( heightMap.image,  0, 0, resolution, resolution );
        const material = HeightMapMaterial();

    },[heightMap])

    useEffect(()=>{
        /*
        material.uniforms.uHeightMap.value = heightMap; 
        material.uniforms.uHeightScale.value=heightScale;
        meshRef.current.material = material;
        */
    },[textureContext])

    useEffect(()=>{
        meshRef.current.material.uniforms.uTime.value=timestampToHourFloat(timestamp);
    },[timestamp])

    useEffect(()=>{
        if(!gridMap || !heightMap ) return; 
        const _cellArr = [];
        var _scale = 1; 



        // GET SCALE
        const firstItem = gridMap.paths[0];
        const grp = new Group();
        firstItem.toShapes().forEach(s =>{
            const geo = new ShapeGeometry(s);
            const mat = new MeshBasicMaterial();
            const mesh = new Mesh(geo, mat)
            grp.add(mesh)
        })

        const box = new Box3().setFromObject(grp);
        const center = box.getCenter(new Vector3());
        _scale = center.x*2;
        console.log('scale : ', _scale)
        setGridScale(_scale);

        // RECTS
        const rects = gridMap.paths.filter( item=> item!== firstItem && item.userData.node.localName =="rect" );
        rects.forEach((path)  =>{
            const transform = getTransformFromPath( path.currentPath, _scale );
            const valueFromHeightMap = GetValueFromImage(transform.position.x,transform.position.y)

            // World 
            transform.position.x = transform.position.x * scale - scale/2 ; 
            transform.position.z = -transform.position.y * scale   + scale/2  ;// - (transform.position.y * scale - scale/2 ); 
            transform.position.y = valueFromHeightMap * scale * heightScale;


            path.toShapes().forEach(s =>{
                _cellArr.push({shape: s, transform: transform });
            })
        })   

        setCellArray(_cellArr)
        props.onCellUpdate( _cellArr.map( _cell => _cell.transform ) );


        // STREET
        const paths = gridMap.paths.filter( item=> item.userData.node.localName =="path");
        /*
        const _streetArr =[];

        paths.forEach((path)=>{
            const transform = getTransformFromPath( path.currentPath, _scale );
            const valueFromHeightMap = GetValueFromImage(transform.position.x,transform.position.y)

            // World 
            transform.position.x = transform.position.x * scale - scale/2 ; 
            transform.position.z = -transform.position.y * scale   + scale/2  ;// - (transform.position.y * scale - scale/2 ); 
            transform.position.y = valueFromHeightMap * scale * heightScale;


            path.toShapes().forEach(s =>{
                _streetArr.push({shape: s, transform: transform });
            })
        })
            */ 
        setStreetArray(paths);

    },[gridMap , heightMap ])



    const getTransformFromPath = ( path, _canvasScale ) => {


        const v1 = path.curves[0].v1;
        const v2 = path.curves[0].v2;
        const v3 = path.curves[1].v2; // v2 of the second curve
        const v4 = path.curves[2].v2; // v2 of the third curve
    
    
        const dir = v2.clone().sub(v1); // v2-v1
        const angle = Math.atan2(dir.y, dir.x)
        const rotation = new Vector3(0,-MathUtils.radToDeg(angle), 0)
    
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
     }


     const onMouseOver = (isOver, evt)=>{
        const material =  evt.object.material ;
        material.uniforms.uMouseOver.value = isOver; 
     }

    


    

    return (
<>


    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, -Math.PI ]} scale={scale} visible={true} position={[0,-.1,0]}>
        <planeGeometry args={[1, 1, 20, 20]} />
    </mesh>



    <group position={[0,.01,0]} ref={gridRef}>
        {cellArray.map((cell, i ) =>
            <group key={i}>
            <mesh  material={GridMaterial()}
                            position={[ -scale/2 , cell.transform.position.y , +scale/2  ]}
                            rotation={[-Math.PI / 2, 0, 0]} 
                            scale = { scale/gridScale }
                            onClick={(e)=>{onClickCell(e, cell.transform)}}
                            onPointerEnter={(evt)=>{onMouseOver(true, evt)}}
                            onPointerLeave={(evt)=>{onMouseOver(false, evt)}}
                        >
                            <shapeGeometry args={[cell.shape]} />
                        </mesh>

            <lineSegments position={[ -scale/2 , cell.transform.position.y , +scale/2  ]}
                        rotation={[-Math.PI / 2, 0, 0]} 
                        scale = { scale/gridScale }>
                <edgesGeometry args = {[new ShapeGeometry(cell.shape)]} />
                <lineBasicMaterial attach="material" color="white" linewidth={10000} depthTest={false} depthFunc={false} blending={AdditiveBlending} Side={DoubleSide}/>
            </lineSegments>
            </group>
        )}
    </group>



    <group  position={[ -scale/2 ,0, +scale/2  ]} rotation={[-Math.PI / 2, 0, 0]}  scale = { scale/gridScale }>
        {streetArray.map((path, i ) =>
            <StrokeMesh key={i} path={path} />
        )}
    </group>



</>


)}


