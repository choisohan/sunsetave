import React,{useRef,useEffect} from 'react'
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshStandardMaterial, MeshBasicMaterial, DirectionalLight  , TextureLoader , NearestFilter } from 'three';

export default function Scene(){
    const houseModels = useLoader(FBXLoader, '/models/houses.fbx')
    const texture = useLoader(TextureLoader, "/models/house_proxy.png"); 
    const modelRef = useRef();


    useEffect(() => {
        if ( houseModels ) {
            houseModels.traverse((child) => {
                if (child.isMesh) {
                    texture.minFilter = NearestFilter;
                    texture.magFilter = NearestFilter;
                    texture.generateMipmaps = false;
                    child.material = new MeshStandardMaterial({map : texture });
                }
              });
        }
      }, [houseModels, texture]);

    return (
        <Canvas style={{width:'100vw',height:'100vh'}}>

            <OrbitControls />

            <directionalLight position={[0, 5, 5]} intensity={1} />
            <ambientLight />

            <primitive  ref={modelRef} object={houseModels} scale={1} />
        </Canvas>)
}
