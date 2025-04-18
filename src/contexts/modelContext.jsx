import React,{useState,useContext, useEffect} from "react";

import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import {  NearestFilter , ClampToEdgeWrapping, TextureLoader} from 'three';
import { HouseMaterial } from "../shaders/houseMaterial";

const HouseModelContext = React.createContext();
const HouseTextureContext = React.createContext();


const useTextures =  () => {
    const [paths, setPaths] = useState(null);

    useEffect(() => {
        fetch("/textures.json")
          .then(res => res.json())
          .then(setPaths);
      }, []);

      const textures = useLoader(TextureLoader, paths ?? []);

      const textureMap = paths && textures
      ? paths.reduce((acc, path, i) => {
          acc[path.replace('/textures/','').replace('.png','')] = textures[i];
          textures[i].magFilter = NearestFilter;
          textures[i].generateMipmaps = false;
          textures[i].wrapS = textures[i].wrapT = ClampToEdgeWrapping; //prevent bleeding
          return acc;
        }, {})
      : null;
        return textureMap;

};

const swapMaterialToHouse = (_currentMat)=>{
    const houseMaterial = HouseMaterial();
    if(["W1","W2","D"].includes( _currentMat.name.replace('_mat','') )  ){
        houseMaterial.uniforms.uIsWindow.value = true;
    }
    houseMaterial.name = _currentMat.name;
    return houseMaterial; 
}

const useFBXModels = ()=>{
    const sortedModels = {};
    const _fbxFile = useLoader(FBXLoader, '/models/houses.fbx'); 
    _fbxFile.traverse((child) => {
        if (child.isMesh ) {

            child.position.x = 0;
            child.position.y = 0;
            child.position.z = 0;      
            
            if(Array.isArray(child.material)){
                child.material = child.material.map(m=>swapMaterialToHouse(m))

            }else if(child.material){
                child.material = swapMaterialToHouse(child.material)

            }
                
            sortedModels[child.name] = child;
        }
    });
    return sortedModels
} 


export function ModelProvider({children}){
    const modelFile = useFBXModels(); 
    const textures = useTextures();

    useEffect(()=>{
        console.log( textures)
    },[textures])
	return (
        <HouseTextureContext.Provider value={textures}>
            <HouseModelContext.Provider value={modelFile}>
                {children}
            </HouseModelContext.Provider>
        </HouseTextureContext.Provider>

	)
}

export function useHouseModel(){
	return useContext(HouseModelContext)
}
export function useTexture(){
	return useContext(HouseTextureContext)
}
