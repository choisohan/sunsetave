import React,{useContext,useState} from "react";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const TimestampContext = React.createContext();
const UpdateTimestampContext = React.createContext();
const SkyColorMapContext = React.createContext();



export function EnvProvider({children}){
    const [ timestamp,setTimeSamp] = useState( new Date().getTime()  );
    const skyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');;


    return (
        <SkyColorMapContext.Provider value={skyColorMap}>
            <UpdateTimestampContext.Provider value={setTimeSamp}>
                <TimestampContext.Provider value={timestamp}>
                    {children}
                </TimestampContext.Provider>                
            </UpdateTimestampContext.Provider>
        </SkyColorMapContext.Provider>

    )
}

export function useTimestamp(){
    return useContext(TimestampContext)
}
export function useUpdateTimestamp(){
    return useContext(UpdateTimestampContext)
}
export function useSkyColorMap(){
    return useContext(SkyColorMapContext)
}
