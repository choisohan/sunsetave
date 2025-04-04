import React,{useContext,useState} from "react";

const TimestampContext = React.createContext();
const UpdateTimestampContext = React.createContext();



export function EnvProvider({children}){
    const [ timestamp,setTimeSamp] = useState( new Date().getTime()  );


    return (
            <UpdateTimestampContext.Provider value={setTimeSamp}>
                <TimestampContext.Provider value={timestamp}>
                    {children}
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
