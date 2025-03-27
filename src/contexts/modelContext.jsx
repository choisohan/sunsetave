import React,{useState,useContext, useEffect} from "react";

import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import {  NearestFilter , ClampToEdgeWrapping, TextureLoader} from 'three';
import { HouseMaterial } from "../shaders/houseMaterial";

const HouseModelContext = React.createContext();
const HouseTextureContext = React.createContext();


const useTextures = () => {
    const nameArr = ["roof/R1","roof/R2","roof/R3", "roof/R4","roof/R5",
                        "wall/W1","wall/W2","wall/W3","wall/W4","wall/W5",
                        "windows/W1","windows/W2","windows/W3","windows/W4","windows/W5",
                        "signs/S1",
                    
                    ];
    const textureFiles = useLoader(TextureLoader, nameArr.map(name => `/textures/${name}.png`))
    const textures = {};
    nameArr.forEach( (name,i)=>{
        const textureFile = textureFiles[i];
        textures[name] = textureFile;
        textureFile.magFilter = NearestFilter;
        textureFile.generateMipmaps = false;
        textureFile.wrapS = textureFile.wrapT = ClampToEdgeWrapping; //prevent bleeding
    })
    return textures;
};

const swapMaterialToHouse = (_currentMat)=>{
    const houseMaterial = HouseMaterial();
    if(_currentMat.name.includes('Windows')){
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
