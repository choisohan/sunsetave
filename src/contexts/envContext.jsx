import React,{useContext,useState} from "react";

const TimestampContext = React.createContext();
const UpdateTimestampContext = React.createContext();
const TimezoneOverride = React.createContext();
const SetTimezoneOVerride = React.createContext();



export function EnvProvider({children}){
    const [ timestamp,setTimeSamp] = useState( new Date().valueOf()  );
    const [ timezoneOverride, setTimezoneOverride] = useState();


    return (
            <UpdateTimestampContext.Provider value={setTimeSamp}>
                <TimestampContext.Provider value={timestamp}>
                    <TimezoneOverride.Provider value={timestamp}>
                        <SetTimezoneOVerride.Provider value={timestamp}>
                            {children}
                        </SetTimezoneOVerride.Provider>
                    </TimezoneOverride.Provider>
                </TimestampContext.Provider>                
            </UpdateTimestampContext.Provider>
    )
}

export function useTimestamp(){
    return useContext(TimestampContext)
}
export function useUpdateTimestamp(){
    return useContext(UpdateTimestampContext)
}
export function useTimezoneOverride(){
    return useContext(TimezoneOverride)
}
export function useSetTimezoneOverride(){
    return useContext(SetTimezoneOVerride)
}

