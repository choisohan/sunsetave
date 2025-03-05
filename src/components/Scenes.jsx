import React,{ useEffect, useRef, useState} from 'react'
import { useLoader , Canvas} from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from '@react-three/drei';
import {  NearestFilter , ClampToEdgeWrapping, BoxGeometry} from 'three';
import {House} from './House';


export default function Scene(){
    const models = useLoader(FBXLoader, '/models/houses.fbx')

    useEffect(() => {

        if ( models ) {
            models.traverse((child) => {

                if (child.isMesh) {

                    child.material.forEach(mat => {
                        mat.map.magFilter = NearestFilter;
                        mat.map.generateMipmaps = false;
                        mat.map.wrapS = mat.map.wrapT = ClampToEdgeWrapping; //prevent bleeding
                        mat.needsUpdate = true;

                    });
                }
              });
        }


      }, [models]);





    return (
        <Canvas style={{width:'100vw',height:'100vh', background: 'gray'}}  camera={{position: [2,5,7], fov: 50}} >


            <OrbitControls />

            <directionalLight position={[0, 5, 5]} intensity={1} />
            <ambientLight />



            <House models= {models} geo={4} position={{x: 2,y:0, z: 0}} UDIM={[1,0]} />
            <House models= {models} geo={1} position={{x: 0,y:0, z: 0}}  UDIM={[0,1]} />
            <House models= {models} geo={2}  position={{x: -2,y:0, z: 0}}  UDIM={[1,0]} />

            <House models= {models} geo={3} position={{x: 3,y:0, z: 2}} UDIM={[0,1]} />
            <House models= {models} geo={4} position={{x: 0,y:0, z: 2}}  UDIM={[1,0]} />
            <House models= {models} geo={1} position={{x: -3,y:0, z: 2}} UDIM={[0,0]}  />


        </Canvas>)
}
