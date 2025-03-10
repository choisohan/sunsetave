import React,{useState,useContext, useEffect} from "react";

import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import {  NearestFilter , ClampToEdgeWrapping, TextureLoader} from 'three';
import { HouseMaterial } from "../shaders/houseMaterial";

const ModelContext = React.createContext();
const TextureContext = React.createContext();


const useTextures = () => {
    const nameArr = ["roof/R1", "wall/W1", "windows/W1"];
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

const swapMaterialToHouse = (_currentMat, _paperTexture)=>{
    const houseMaterial = HouseMaterial();
    if(_currentMat.name.includes('windows')){
        houseMaterial.transparent=true; 
    }
    houseMaterial.name = _currentMat.name;
    houseMaterial.uniforms.uPaperMap.value = _paperTexture;
    return houseMaterial; 
}

const useFBXModels = ()=>{
    const sortedModels = {};
    const _paperTexture = useLoader(TextureLoader, '/models/paperTexture.png');
    const _fbxFile = useLoader(FBXLoader, '/models/houses.fbx'); 
    _fbxFile.traverse((child) => {
        if (child.isMesh && child.name.includes('house')) {

            child.position.x = 0;
            child.position.y = 0;
            child.position.z = 0;      

            if(Array.isArray(child.material)){
                child.material = child.material.map(m=>swapMaterialToHouse(m, _paperTexture))

            }else if(child.material){
                child.material = swapMaterialToHouse(child.material, _paperTexture)

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
        <TextureContext.Provider value={textures}>
            <ModelContext.Provider value={modelFile}>
                {children}
            </ModelContext.Provider>
        </TextureContext.Provider>

	)
}

export function useModel(){
	return useContext(ModelContext)
}
export function useTexture(){
	return useContext(TextureContext)
}
