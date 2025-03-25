import React,{useContext,useState} from "react";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const TimeContext = React.createContext();
const UpdateTimeContext = React.createContext();

const SkyColorMapContext = React.createContext();



export function EnvProvider({children}){
    const [time,setTime] = useState(0.5); 
    const skyColorMap = useLoader(TextureLoader, '/textures/env/skyColormap.png');;


    return (
        <SkyColorMapContext.Provider value={skyColorMap}>
            <UpdateTimeContext.Provider value={setTime}>
                <TimeContext.Provider value={time}>
                    {children}
                </TimeContext.Provider>                
            </UpdateTimeContext.Provider>

        </SkyColorMapContext.Provider>

    )
}

export function useTime(){
    return useContext(TimeContext)
}
export function useUpdateTime(){
    return useContext(UpdateTimeContext)
}
export function useSkyColorMap(){
    return useContext(SkyColorMapContext)
}
