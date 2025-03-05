import React,{useState,useContext, useEffect} from "react";

import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import {  NearestFilter , ClampToEdgeWrapping, TextureLoader} from 'three';


const ModelContext = React.createContext();
const ModelUpdateContext = React.createContext();

export function ModelProvider({children}){
	const [models, setModels]= useState(null)

    var _model= useLoader(FBXLoader, '/models/houses.fbx'); 
    const _paperTexture = useLoader(TextureLoader, 'models/paperTexture.png');

    useEffect(()=>{
        const sortedModels = _model;
        sortedModels.traverse((child) => {
            if (child.isMesh) {
                child.material.forEach(mat => {
                    mat.map.magFilter = NearestFilter;
                    mat.map.generateMipmaps = false;
                    mat.map.wrapS = mat.map.wrapT = ClampToEdgeWrapping; //prevent bleeding
                    mat.needsUpdate = true;
                    mat.specularMap = _paperTexture;  //just passing
                });
            }
        });
        setModels({ ...sortedModels })
    },[_model])



	return (
		<ModelContext.Provider value={models}>
			<ModelUpdateContext.Provider value={setModels}>
				{children}
			</ModelUpdateContext.Provider>
		</ModelContext.Provider>
	)
}

export function useModel(){
	return useContext(ModelContext)
}
export function useUpdateModel(){
	return useContext(ModelUpdateContext)
}